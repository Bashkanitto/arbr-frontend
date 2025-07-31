import { BaseButton } from '@shared/ui/Button/BaseButton'
import { Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { changeVendorGroupPrice, editProduct } from '@services/api/productService'
import NotificationStore from '@features/notification/model/NotificationStore'
import MDEditor from '@uiw/react-md-editor'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { updateBonus, updateDiscount } from '@services/api/bonusService'
import { fetchBrands } from '@services/api/brandService'
import { ProductType } from '@services/api/Types'

type Props = {
  isOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  product: ProductType
  setProduct: Dispatch<SetStateAction<ProductType | undefined>>
}

const ProductEditModal: React.FC<Props> = ({ isOpen, setIsEditModalOpen, product, setProduct }) => {
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [newBonus, setNewBonus] = useState<string | number>(
    product.vendorGroups[0].features?.bonus || 0
  )
  const [newDiscount, setNewDiscount] = useState<string | number>(
    product.vendorGroups[0].features?.discount || 0
  )
  const [brandSearch, setBrandSearch] = useState<string>('')
  const [vendorGroupPrice, setVendorGroupPrice] = useState<string | number | undefined | null>(null)
  const [filteredBrands, setFilteredBrands] = useState<{ value: string; label: string }[]>([])

  const handleEditProduct = async () => {
    try {
      const productResponse = await editProduct(product?.id, product)
      const vendorGroupPriceResponse = await changeVendorGroupPrice(
        product.vendorGroups[0].id,
        vendorGroupPrice || product.vendorGroups[0].price
      )
      await updateBonus(product.vendorGroups[0]?.id, newBonus)
      await updateDiscount(product.vendorGroups[0]?.id, newDiscount)

      setVendorGroupPrice(vendorGroupPriceResponse.data.price)

      NotificationStore.addNotification('Товар', 'Товар успешно отредактирован!', 'success')
      setIsEditModalOpen(false)

      if (productResponse.status !== 200) {
        throw new Error('Произошла ошибка при редактировании товара!')
      }
    } catch (err) {
      NotificationStore.addNotification(
        'Товар',
        'Произошла ошибка при редактировании товара!',
        'error'
      )
      console.error('Ошибка при редактировании товара:', err)
    }
  }

  const handleInputChange = async (field: keyof ProductType, value: any) => {
    setProduct((prev: any) => {
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  useEffect(() => {
    const loadData = async () => {
      const brandsResponse: any = await fetchBrands()
      const brandOptions = brandsResponse.data.records.map((brand: any) => ({
        value: brand.id.toString(),
        label: brand.name,
      }))
      setBrands(brandOptions)
      setFilteredBrands(brandOptions)
    }

    loadData()
  }, [])

  useEffect(() => {
    const filtered =
      brandSearch.trim() === ''
        ? brands
        : brands.filter(brand => brand.label.toLowerCase().includes(brandSearch.toLowerCase()))
    setFilteredBrands(filtered)
  }, [brandSearch, brands])

  return (
    <Modal opened={isOpen} withCloseButton={false} onClose={() => setIsEditModalOpen(false)}>
      <TextInput
        required
        label="Название товара"
        value={product.name}
        onChange={e => handleInputChange('name', e.currentTarget.value)}
      />
      <label htmlFor="mdEditor">Описание</label>
      <MDEditor
        id="mdEditor"
        value={product.description}
        onChange={value => handleInputChange('description', value)}
        height={400}
      />
      <NumberInput
        label="Количество"
        value={product.quantity}
        onChange={value => handleInputChange('quantity', value ?? 0)}
      />
      <NumberInput
        label="Цена"
        value={vendorGroupPrice || product.vendorGroups[0]?.price || 0}
        onChange={value => setVendorGroupPrice(value ?? 0)}
      />
      <Select
        label="Бренд"
        data={filteredBrands}
        searchable
        searchValue={brandSearch}
        onSearchChange={setBrandSearch}
        defaultValue={product.brand?.name}
        placeholder="Выберите бренд..."
      />
      <NumberInput
        label="Бонус %"
        max={100}
        value={product.vendorGroups[0].features?.bonus}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => setNewBonus(value)}
      />
      <NumberInput
        label="Скидка %"
        max={100}
        value={product.vendorGroups[0].features?.discount}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => setNewDiscount(value)}
      />
      <NumberInput
        label="ЕНС ТРУ"
        placeholder="Введите ЕНС ТРУ"
        value={product.ENSTRU?.toString()}
        onChange={value => handleInputChange('ENSTRU', value ?? 0)}
      />
      <NumberInput
        label="GTIN"
        value={product.GTIN?.toString()}
        placeholder="Введите GTIN"
        onChange={value => handleInputChange('GTIN', value ?? 0)}
      />
      <NumberInput
        label="KZTIN"
        placeholder="Введите KZTIN"
        value={product.KZTIN?.toString()}
        onChange={value => handleInputChange('KZTIN', value ?? 0)}
      />
      <BaseButton variantColor="primary" onClick={handleEditProduct}>
        Сохранить
      </BaseButton>
    </Modal>
  )
}

export default ProductEditModal
