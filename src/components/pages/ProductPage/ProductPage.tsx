/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Skeleton, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	deleteDocument,
	deleteProduct,
	fetchProductById,
	uploadMultipleImages,
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
	const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([])

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setSelectedFiles(Array.from(event.target.files))
		}
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const filesArray = Array.from(event.target.files)
			console.log('Выбранные файлы:', filesArray)
			setSelectedImageFiles(filesArray)
		}
	}
	

	const handleUploadImage = async () => {
		console.log('Файлы для загрузки:', selectedImageFiles)
		if (selectedImageFiles.length === 0) {
			NotificationStore.addNotification('Ошибка', 'Выберите изображение', 'error')
			return
		}

		const allowedExtensions = ['jpg', 'jpeg', 'png']
		for (const file of selectedImageFiles) {
			const ext = file.name.split('.').pop()?.toLowerCase()
			if (!ext || !allowedExtensions.includes(ext)) {
				NotificationStore.addNotification('Ошибка', 'Допустимые форматы: jpg, png', 'error')
				return
			}
		}

		try {
			await uploadMultipleImages(selectedImageFiles, product.id)
			NotificationStore.addNotification('Успех', 'Изображение загружено!', 'success')
			setIsImageModalOpen(false)
			// Обновление данных после загрузки
			const updatedProduct = await fetchProductById(id)
			setProduct(updatedProduct)
		} catch (error) {
			console.error(error)
			NotificationStore.addNotification('Ошибка', 'Не удалось загрузить изображение', 'error')
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
		// Validate that at least one file is selected
		if (selectedFiles.length === 0) {
			NotificationStore.addNotification(
				'Документы',
				'Пожалуйста, выберите хотя бы один документ.',
				'error'
			)
			return
		}

		// Define allowed file extensions
		const allowedExtensions = ['xlsx', 'pdf']

		// Validate file extensions for all selected files
		for (const file of selectedFiles) {
			const ext = file.name.split('.').pop()?.toLowerCase()
			if (!ext || !allowedExtensions.includes(ext)) {
				NotificationStore.addNotification(
					'Документы',
					'Неверный формат файла. Допустимы только файлы с расширением .xlsx или .pdf.',
					'error'
				)
				return
			}
		}

		// If validation passes, proceed with upload
		try {
			await uploadProductDocument(selectedFiles, product.vendorGroups[0].id)
			NotificationStore.addNotification(
				'Документы',
				'Документы успешно добавлены!',
				'success'
			)
			setIsDocumentModalOpen(false)
			// Optionally reload the page or update state
			// window.location.reload();
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
			link.download = `${customFileName.split('.')[0]}.xlsx` // Use your custom name
			link.click()
			URL.revokeObjectURL(objectUrl)
		} catch (error) {
			console.error('Error while downloading file:', error)
		}
	}

	const getTextColor = (quantity: number): string => {
		if (quantity < 20) return 'danger' // красный цвет
		if (quantity < 60) return 'warning' // зеленый цвет
		return 'active'
	}

	const handleDeleteProduct = async (productId: number) => {
		try {
			const response = await deleteProduct(productId)
			console.log(response)
			NotificationStore.addNotification(
				'Продукт',
				'Продукт успешно удален!',
				'success'
			)
		} catch (err) {
			NotificationStore.addNotification(
				'Продукт',
				'Произошла ошибка при удалении продукта!',
				'error'
			)
			console.log(err)
		} finally {
			setTimeout(() => {
				window.location.href = '/catalog'
			}, 2000)
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

	if (error) return <div>{error}</div>
	if (!product) {
		return <Skeleton />
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
							src={image.url.replace(
								'http://3.76.32.115:3000',
								'https://rbr.kz'
							)}
							alt=''
						/>
					)
				)}
				<BaseButton onClick={() => setIsImageModalOpen(true)}>Добавить фото</BaseButton>
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
								{product.vendorGroups[0].productDocuments.map(
									(productDocument: any) => (
										<li
											className={styles.productDocumentsItem}
											key={productDocument.id}
										>
											{productDocument.originalname.split('.')[0].length >= 35
												? productDocument.originalname
														.split('.')[0]
														.substring(0, 35) + '...'
												: productDocument.originalname.split('.')[0]}
											<div className={styles.documentAction}>
												<a
													onClick={() =>
														downloadFile(
															productDocument.url,
															productDocument.originalname
														)
													}
												>
													<DownloadIcon />
												</a>

												<a
													href='#'
													onClick={() =>
														handleDeleteDocument(productDocument.filename)
													}
												>
													<DeleteIcon />
												</a>
											</div>
										</li>
									)
								)}
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
								{product.ENSTRU}
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
				{product.status !== 'active' ? (
					<BaseButton
						onClick={() => handleDeleteProduct(product.id)}
						className={styles['deleteProduct']}
					>
						Удалить продукт
					</BaseButton>
				) : null}
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

			<Modal opened={isImageModalOpen} onClose={() => setIsImageModalOpen(false)}>
				<TextInput type='file' onChange={handleImageChange} multiple />
				<p style={{ color: 'grey', margin: '10px 0' }}>Допустимые форматы: jpg, png</p>
				<BaseButton variantColor='primary' onClick={handleUploadImage}>
					Загрузить
				</BaseButton>
			</Modal>
		</div>
	)
}

export default ProductPage
