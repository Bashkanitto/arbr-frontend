/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../../../services/api/productService'
import styles from './ProductPage.module.scss'

interface Product {
	name: string
	quantity: number
	price: number
	images: { url: string }[]
	order: string
	details: string
}

const ProductPage = () => {
	const { id } = useParams<{ id: string }>()
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	// Fetch product details on component mount
	useEffect(() => {
		const loadProduct = async () => {
			try {
				setLoading(true)
				const fetchedProduct: any = await fetchProductById(id)
				setProduct(fetchedProduct)
			} catch (err: unknown) {
				setError(
					err instanceof Error
						? `Failed to load product: ${err.message}`
						: 'An unknown error occurred'
				)
			} finally {
				setLoading(false)
			}
		}
		loadProduct()
	}, [id])

	// Handling loading and error states
	if (loading) return <div>Loading...</div>
	if (error) return <div>{error}</div>

	if (!product) return <div>Product not found.</div>

	return (
		<div className={styles['product-page']}>
			<div className={styles['product-image']}>
				<img src={product.images[0]?.url} alt='' />
				<img src={product.images[1]?.url} alt='' />
				<img src={product.images[2]?.url} alt='' />
			</div>
			<div className={styles['product-info']}>
				<div className={styles['container']}>
					<p className={styles['product-breadcrumbs']}>
						Товар <span>{product.name}</span>
					</p>
					<h4>{product.name}</h4>
					<p className={styles['product-count']}>
						<span>{product.quantity} </span>в наличии
					</p>
					<div className={styles['product-price']}>
						<span>Цена за товар</span>
						<p>{product.price}₸ </p>
					</div>
					<button>% ИЗМЕНИТЬ ПРОЦЕНТ</button>
					<div className={styles['product-details']}>
						<p>
							Доставка <span>{product.order}</span>
						</p>
						<p>
							Описание <span>K</span>
						</p>
						<p>
							Характеристики <span>{product.details}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductPage
