/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Skeleton, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	deleteDocument,
	deleteProduct,
	fetchProductById,
	uploadProductDocument,
} from '../../../services/api/productService'
import EditProcentModal from '../CatalogPage/EditProcentModal/EditProcentModal'
import styles from './ProductPage.module.scss'
import { BaseButton } from '../../atoms/Button/BaseButton'
import FullViewImageModal from '../../molecules/FullViewImageModal/FullViewImageModal'
import { DownloadIcon } from '../../../assets/icons/DownloadIcon'
import NotificationStore from '../../../store/NotificationStore'
import { DeleteIcon } from '../../../assets/icons'

const ProductPage = () => {
	const { id } = useParams<{ id: string }>()
	const [product, setProduct] = useState<any | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [infoVisibility, setInfoVisibility] = useState<number | null>()
	const [error, setError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<string>('описание')
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
	const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<boolean>(false)
	const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false)
	const [selectedImage, setSelectedImage] = useState<string>('')

	const [selectedFiles, setSelectedFiles] = useState<File[]>([])

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setSelectedFiles(Array.from(event.target.files))
		}
	}
	function openViewModal(imageUrl: string) {
		setSelectedImage(imageUrl)
		setIsViewModalOpen(true)
	}

	const closeViewModal = () => {
		setIsViewModalOpen(false)
		setSelectedImage('')
	}


	const handleDeleteDocument = async (fileName: string) => {
		try {
			await deleteDocument(fileName)
			NotificationStore.addNotification(
				'Документы',
				'Документы успешно уделен!',
				'success'
			)
		} catch (err) {
			console.log(err)
			NotificationStore.addNotification(
				'Документы',
				'Произошла ошибка при удалении документа!',
				'error'
			)
		}
	}

	const handleSubmit = async () => {
		if (selectedFiles) {
			try {
				await uploadProductDocument(selectedFiles, product.vendorGroups[0].id)
				NotificationStore.addNotification(
					'Документы',
					'Документы успешно добавлены!',
					'success'
				)
				setIsDocumentModalOpen(false)
				// window.location.reload()
			} catch (error) {
				console.error(error)
				NotificationStore.addNotification(
					'Документы',
					'Произошла ошибка при добавлении документа!',
					'error'
				)
				setIsDocumentModalOpen(false)
			}
		}
	}

	useEffect(() => {
		const loadProduct = async () => {
			try {
				setLoading(true)
				const response: any = await fetchProductById(id)
				setProduct(response)
			} catch (err: any) {
				setError(err.message || 'An unknown error occurred')
			} finally {
				setLoading(false)
			}
		}
		loadProduct()
	}, [id])

	const downloadFile = async (url: string, customFileName: string) => {
		try {
			const response = await fetch(url)

			if (!response.ok) {
				throw new Error(`Failed to fetch file: ${response.statusText}`)
			}

			const blob = await response.blob()
			const link = document.createElement('a')
			const objectUrl = URL.createObjectURL(blob)
			link.href = objectUrl
			link.download = `${customFileName}.xlsx` // Use your custom name
			link.click()
			URL.revokeObjectURL(objectUrl)
		} catch (error) {
			console.error('Error while downloading file:', error)
		}
	}

	if (error) return <div>{error}</div>
	if (!product) {
		return <Skeleton />
	}


	const getTextColor = (quantity: number): string => {
		if (quantity < 20) return 'danger' // красный цвет
		if (quantity < 60) return 'warning' // зеленый цвет
		return 'active'
	}

	const handleDeleteProduct = async(productId:number) => {
		try{
			const response = await deleteProduct(productId)
			console.log(response)
		}catch(err){
			console.log(err)
		}
	}

	const handleTabClick = (tab: string) => {
		setActiveTab(tab)
	}

	const openEditModal = () => {
		setIsEditModalOpen(true)
	}

	const closeEditModal = () => {
		setIsEditModalOpen(false)
	}

	return (
		<div className={styles['product-page']}>
			<div className={styles['product-image']}>
				{product.images?.map((image: { url: string }) =>
					loading ? (
						<Skeleton key={product.id} width={600} height={400} radius={15} />
					) : (
						<img
							onClick={() => openViewModal(image.url)}
							style={{ cursor: 'pointer' }}
							key={product.id}
							src={image.url.replace('http://3.76.32.115:3000', 'https://rbr.kz')}
							alt=''
						/>
					)
				)}
				<div className={styles.tabs}>
					<ul>
						<li
							className={activeTab === 'описание' ? styles.active : ''}
							onClick={() => handleTabClick('описание')}
						>
							Описание
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
							{product.options}
						</div>
					)}
					{activeTab === 'Документы' && (
						<div className={styles.tabBody}>
							<BaseButton
								variantColor='primary'
								onClick={() => setIsDocumentModalOpen(true)}
							>
								Добавить документ
							</BaseButton>
							<ul className='flex '>
								{product.vendorGroups[0].productDocuments.map((productDocument: any) => (
									<li key={productDocument.id}>
										{productDocument.bucket}
										<div className={styles.documentAction}>
											<a
												onClick={() =>
													downloadFile(productDocument.url, productDocument.originalName)
												}
											>
												<DownloadIcon />
											</a>

											<a
												href='#'
												onClick={() => handleDeleteDocument(productDocument.filename)}
											>
												<DeleteIcon />
											</a>
										</div>
									</li>
								))}
							</ul>
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
						<span className={`${getTextColor(product.quantity)}`}>
							{product.quantity}
						</span>{' '}
						в наличии
					</p>
					<div className={styles['product-price']}>
						<span>Цена за товар</span>
						<p>{product.price}₸ </p>
					</div>
					<button onClick={openEditModal}>% ИЗМЕНИТЬ ПРОЦЕНТ</button>
					<div className={styles['product-details']}>
						<a onClick={() => setInfoVisibility(0)}>
							Характеристики
							<p style={{ height: infoVisibility == 0 ? '100px' : '0px' }}>
								{product.options}
							</p>
						</a>
						<a onClick={() => setInfoVisibility(1)}>
							ЕНС ТРУ
							<p style={{ height: infoVisibility == 1 ? '40px' : '0px' }}>
								asdasds
							</p>
						</a>
						<a onClick={() => setInfoVisibility(2)}>
							GTIN (штрихкод)
							<p style={{ height: infoVisibility == 2 ? '40px' : '0px' }}>
								{product.code}
							</p>
						</a>
						<a onClick={() => setInfoVisibility(3)}>
							KZTIN (для гос. закупок)
							<p style={{ height: infoVisibility == 3 ? '40px' : '0px' }}>
								{product.KZTIN}
							</p>
						</a>

						<a onClick={() => setInfoVisibility(4)}>
							Статус
							<p style={{ height: infoVisibility == 4 ? '40px' : '0px' }}>
								{product.status}
							</p>
						</a>
					</div>
				</div>
				<button onClick={()=>handleDeleteProduct(product.id)} className={styles['deleteProduct']}>Удалить продукт</button>
			</div>

			<EditProcentModal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				user={{ vendorGroups: [{ product }] }}
			/>

			<FullViewImageModal
				imageUrl={selectedImage}
				isOpen={isViewModalOpen}
				onClose={closeViewModal}
			/>

			<Modal
				opened={isDocumentModalOpen}
				onClose={() => setIsDocumentModalOpen(false)}
				withCloseButton={false}
			>
				<TextInput type='file' onChange={handleFileChange} />
				<p style={{ color: 'grey', margin: '10px 0' }}>
					Допустимые форматы: xlsx, pdf
				</p>
				<BaseButton
					style={{ width: '100%' }}
					variantColor='primary'
					onClick={handleSubmit}
				>
					Отправить
				</BaseButton>
			</Modal>
		</div>
	)
}

export default ProductPage
