/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchBrands, fetchSubCategory } from '../../../../services/api/brandService'
import {
	addProduct,
	addVendorGroup,
	fetchAllVendors,
	uploadMultipleImages,
} from '../../../../services/api/productService'
import NotificationStore from '../../../../store/NotificationStore'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './AddProductModal.module.scss'

interface BrandOption {
	value: string
	label: string
}

interface FormData {
	accountId: string
	name: string
	options: string
	quantity: number
	price: number
	brandId: string
	subcategoryId: string
	isBonus: boolean
	isFreeDelivery: boolean
	isDiscount: boolean
	bonus: null | number
	discount: null | number
}

const AddProductModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	const [brands, setBrands] = useState<BrandOption[]>([])
	const [category, setCategory] = useState([])
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [error, setError] = useState<string>('')
	const [accounts, setAccounts] = useState<BrandOption[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [formData, setFormData] = useState<FormData>({
		accountId: '',
		name: '',
		options: '',
		quantity: 1,
		price: 0,
		brandId: '',
		subcategoryId: '',
		isBonus: false,
		isFreeDelivery: false,
		isDiscount: false,
		bonus: null,
		discount: null,
	})

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setSelectedFiles(Array.from(event.target.files))
		}
	}

	useEffect(() => {
		if (isOpen) {
			const loadBrands = async () => {
				try {
					const response: any = await fetchBrands()
					const brandOptions = response.records.map((brand: any) => ({
						value: brand.id.toString(),
						label: brand.name,
					}))
					setBrands(brandOptions)
				} catch (error) {
					console.error('Ошибка загрузки брендов:', error)
				}
			}

			const loadSubCategory = async () => {
				try {
					const response: any = await fetchSubCategory()
					const categoryOptions = response.records.map((category: any) => ({
						value: category.id.toString(),
						label: category.name,
					}))
					setCategory(categoryOptions)
				} catch (error) {
					console.error('Ошибка загрузки брендов:', error)
				}
			}

			const loadVendors = async () => {
				try {
					const response: any = await fetchAllVendors()
					const vendorOptions = response.records.map((vendor: any) => ({
						value: vendor.id.toString(),
						label: vendor.firstName,
					}))
					setAccounts(vendorOptions)
				} catch (error) {
					console.error('Ошибка загрузки поставщиков:', error)
				}
			}
			loadBrands()
			loadSubCategory()
			loadVendors()
		}
	}, [isOpen])

	const handleInputChange = (field: keyof FormData, value: any) => {
		// Преобразуем значение в число и ограничиваем его максимумом 100, если это бонус или скидка
		let newValue = value;

		if (field === 'bonus' || field === 'discount') {
			newValue = Math.min(100, Math.max(0, value));
		}

		setFormData(prev => ({
			...prev,
			[field]: newValue,
			isBonus: field === 'bonus' ? newValue > 0 : prev.isBonus,
			isDiscount: field === 'discount' ? newValue > 0 : prev.isDiscount,
		}))
	}

	const handleAddProduct = async () => {
		setError('')

		if (!formData.accountId) {
			setError('Выберите поставщика')
			return
		}
		if (!formData.name) {
			setError('Выберите название товара')
			return
		}
		if (!formData.price) {
			setError('Выберите цену товара')
			return
		}
		if (selectedFiles.length === 0) {
			setError('Загрузите хотя бы одно изображение')
			return
		}

		try {
			setLoading(true)
			const productResponse: any = await addProduct({
				name: formData.name,
				options: formData.options,
				quantity: formData.quantity || 0,
				price: formData.price || 0,
				brandId: parseInt(formData.brandId, 10),
				subcategoryId: formData.subcategoryId || '0',
				features: {
					isBonus: formData.isBonus,
					isFreeDelivery: formData.isFreeDelivery,
					isDiscount: formData.isDiscount,
					bonus: formData.bonus || null,
					discount: formData.discount || null,
				},
				amountPrice: 0,
				rating: 0,
			})

			const productId = productResponse.id

			await uploadMultipleImages(selectedFiles, productId)

			await addVendorGroup({
				productId: productId,
				vendorId: parseInt(formData.accountId, 10),
				price: formData.price.toString(),
			})

			NotificationStore.addNotification(
				'Добавление товара',
				`Товар c номером ${productId} успешно добавлен`,
				'success'
			)
		} catch (error) {
			NotificationStore.addNotification(
				'Добавление товара',
				'Что-то пошло не так',
				'error'
			)
			console.error('Ошибка:', error)
		} finally {
			setLoading(false)
			onClose()
		}
	}

	return (
		<Modal
			className={styles['addCatalog-modal']}
			opened={isOpen}
			onClose={onClose}
			title='Добавьте Товар'
		>
			<Select
				label='Поставщик'
				required
				data={accounts}
				value={formData.accountId}
				onChange={value => handleInputChange('accountId', value ?? '')}
				placeholder='Выберите имя поставщика'
			/>
			<TextInput
				required
				label='Название товара'
				value={formData.name}
				onChange={e => handleInputChange('name', e.currentTarget.value)}
			/>
			<Select
				label='Категории'
				data={category}
				value={formData.subcategoryId}
				onChange={value => handleInputChange('subcategoryId', value ?? '')}
				placeholder='Выберите категорию'
			/>
			<TextInput
				label='Описание'
				value={formData.options}
				onChange={e => handleInputChange('options', e.currentTarget.value)}
			/>
			<NumberInput
				label='Количество'
				value={formData.quantity}
				onChange={value => handleInputChange('quantity', value ?? 0)}
			/>
			<NumberInput
				label='Цена'
				value={formData.price}
				onChange={value => handleInputChange('price', value ?? 0)}
			/>
			<div className={styles.fileUpload}>
				<label htmlFor='fileInput' className={styles.uploadButton}>
					Загрузить файлы
				</label>
				<input
					required
					type='file'
					id='fileInput'
					multiple
					onChange={handleFileChange}
				/>
				<span className={styles.fileInfo}>
					{selectedFiles.length > 0
						? `${selectedFiles.length} файл(ов) выбрано`
						: 'Файлы не выбраны'}
				</span>
			</div>
			<Select
				label='Бренд'
				data={brands}
				value={formData.brandId}
				onChange={value => handleInputChange('brandId', value ?? '')}
				placeholder='Выберите бренд'
			/>
			<NumberInput
				label='Бонус %'
				max={100}
				min={0}
				placeholder="Введите бонус (0 - 100)"
				onChange={value => handleInputChange('bonus', value ?? 0)}
			/>
			<NumberInput
				label='Скидка %'
				max={100}
				min={0}
				placeholder="Введите бонус (0 - 100)"
				onChange={value => handleInputChange('discount', value ?? 0)}
			/>
			{error && <p className='danger'>{error}</p>}
			<BaseButton
				className={styles['AddCatalog-button']}
				variantColor='primary'
				onClick={handleAddProduct}
				disabled={loading}
			>
				{loading ? 'Добавление...' : 'Добавить Товар'}
			</BaseButton>
		</Modal>
	)
}

export default AddProductModal
