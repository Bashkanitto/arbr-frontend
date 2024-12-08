import { Skeleton } from '@mantine/core'
import jsPDF from 'jspdf'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../../../assets/fonts/Roboto-Regular.ttf'
import { DownloadIcon } from '../../../assets/icons/DownloadIcon'
import { fetchProductById } from '../../../services/api/productService'
import EditProcentModal from '../CatalogPage/EditProcentModal/EditProcentModal'
import styles from './ProductPage.module.scss'

interface Product {
	name: string
	quantity: number
	price: number
	description: string
	images: { url: string }[]
	order: string
}

const ProductPage = () => {
	const { id } = useParams<{ id: string }>()
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<string>('описание')
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)

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

	if (loading) return <Skeleton />
	if (error) return <div>{error}</div>
	if (!product) return <div>Product not found.</div>

	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
	}

	const openEditModal = () => {
		setIsEditModalOpen(true)
	}

	const closeEditModal = () => {
		setIsEditModalOpen(false)
	}

	const downloadPDF = () => {
		const doc = new jsPDF()
		doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
		doc.setFont('Roboto')
		doc.setFontSize(16)
		doc.text('Product Details', 10, 10)
		doc.setFontSize(12)
		doc.text(`Name: ${product.name}`, 10, 20)
		doc.text(`Price: ${product.price}₸`, 10, 30)
		doc.text(`Quantity: ${product.quantity} шт`, 10, 40)
		doc.text(`Description ${product.description}:`, 10, 50)
		doc.save(`${product.name}_details.pdf`)
	}

	return (
		<div className={styles['product-page']}>
			<div className={styles['product-image']}>
				<img src={product.images[0]?.url} alt='' />
				<img src={product.images[1]?.url} alt='' />
				<img src={product.images[2]?.url} alt='' />
				<div className={styles.tabs}>
					<ul>
						<li
							className={activeTab === 'описание' ? styles.active : ''}
							onClick={() => handleTabClick('описание')}
						>
							Описание
						</li>
						<li
							className={activeTab === 'Характеристики' ? styles.active : ''}
							onClick={() => handleTabClick('Характеристики')}
						>
							Характеристики
						</li>
						<li
							className={activeTab === 'Документы' ? styles.active : ''}
							onClick={() => handleTabClick('Документы')}
						>
							Документы
						</li>
					</ul>

					{activeTab === 'описание' && (
						<div id='description' className={styles.tabBody}>
							{product.description}
						</div>
					)}
					{activeTab === 'Документы' && (
						<div className={styles.tabBody}>
							<button className={styles.downloadBtn} onClick={downloadPDF}>
								<DownloadIcon />
								Скачать документ
							</button>
						</div>
					)}
				</div>
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
					<button onClick={openEditModal}>% ИЗМЕНИТЬ ПРОЦЕНТ</button>
					<div className={styles['product-details']}>
						<a href='#description'>
							Доставка <span>{product.order}</span>
						</a>
						<a href='#description'>Характеристики</a>
						<a href='#description'>Описание</a>
						<a href='#description'>ЕНС ТРУ</a>
						<a href='#description'>GTIN (штрихкод)</a>
						<a href='#description'>KZTIN (для гос. закупок)</a>
					</div>
				</div>
			</div>

			<EditProcentModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				user={{ vendorGroups: [{ product }] }}
			/>
		</div>
	)
}

export default ProductPage
