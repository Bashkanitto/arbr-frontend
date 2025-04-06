/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteProduct, fetchProductById } from '@services/api/productService'
import styles from './ProductPage.module.scss'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import NotificationStore from '@store/NotificationStore'
import { wait } from '../../helpers'
import { ProductType } from '@services/api/Types'
import ProductImageSection from './ProductImageSection'
import ProductEditModal from './ProductEditModal'

export interface FormData {
  name?: string
  description?: string
  quantity?: number
  price?: number
  brand?: any
  KZTIN?: number
  GTIN?: number
  ENSTRU?: number
  subcategoryId?: number
  isFreeDelivery?: boolean
  vendorGroups: [
    {
      features?: {
        isBonus?: boolean
        isFreeDelivery?: boolean
        isDiscount?: boolean
        bonus?: string | number | null
        discount?: string | number | null
      }
    },
  ]
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductType>()
  const [infoVisibility, setInfoVisibility] = useState<number | null>()
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>()

  const navigate = useNavigate()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response: any = await fetchProductById(id)
        setFormData(response.data)
        const productData = response.data
        setProduct(productData)
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred')
      }
    }
    loadProduct()
  }, [id])

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId)
      NotificationStore.addNotification('Продукт', 'Продукт успешно удален!', 'success')
      і
    } catch (err) {
      NotificationStore.addNotification(
        'Продукт',
        'Произошла ошибка при удалении продукта!',
        'error'
      )
    }
  }

  if (error) return <div>{error}</div>
  if (!product) {
    return <Skeleton />
  }

  return (
    <div className={styles['product-page']}>
      <ProductImageSection product={product} id={id} setProduct={setProduct} />

      <div className={styles['product-info']}>
        <div className={styles['container']}>
          <p className={styles['product-breadcrumbs']}>
            Товар <span>{product.subcategory?.name}</span>
          </p>
          <h4>{product.name}</h4>
          <p className={styles['product-count']}>
            <span style={{ color: product.quantity < 20 ? 'red' : 'green' }}>
              {product.quantity}
            </span>{' '}
            в наличии
          </p>
          <div className={styles['product-price']}>
            {product.vendorGroups[0].features?.isDiscount ? (
              <span>
                <s>{product.price}₸ </s>
              </span>
            ) : (
              <span>Цена за товар</span>
            )}
            <p>
              {product.vendorGroups[0].features?.discount
                ? product.price * (1 - product.vendorGroups[0].features?.discount / 100)
                : new Intl.NumberFormat('en-KZ').format(product.price)}
              ₸
            </p>
          </div>
          <button onClick={() => setIsEditModalOpen(true)}>ИЗМЕНИТЬ ПРОДУКТ</button>

          <div className={styles['product-details']}>
            <a onClick={() => setInfoVisibility(1)}>
              ЕНС ТРУ
              <p style={{ height: infoVisibility == 1 ? '40px' : '0px' }}>{product.ENSTRU}</p>
            </a>
            <a onClick={() => setInfoVisibility(2)}>
              GTIN (штрихкод)
              <p style={{ height: infoVisibility == 2 ? '40px' : '0px' }}>{product.GTIN}</p>
            </a>
            <a onClick={() => setInfoVisibility(3)}>
              KZTIN (для гос. закупок)
              <p style={{ height: infoVisibility == 3 ? '40px' : '0px' }}>{product.KZTIN}</p>
            </a>
            <a onClick={() => setInfoVisibility(4)}>
              Адресс
              <p style={{ height: infoVisibility == 4 ? '40px' : '0px' }}>{product.location}</p>
            </a>
          </div>
        </div>

        {product.status !== 'active' ? (
          <BaseButton
            onClick={() => {
              handleDeleteProduct(product.id)
              wait(1000).then(() => navigate(-1))
            }}
            className={styles['deleteProduct']}
          >
            Удалить продукт
          </BaseButton>
        ) : (
          <p style={{ padding: '20px 40px', margin: '0 auto', color: 'grey' }}>
            Продукт активно используется
          </p>
        )}
      </div>

      <ProductEditModal
        isOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        product={product as ProductType}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
}

export default ProductPage
