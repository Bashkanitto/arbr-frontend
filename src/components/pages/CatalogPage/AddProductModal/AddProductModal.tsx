import { Checkbox, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchBrands } from '../../../../services/api/brandService'
import {
	addProduct,
	addVendorGroup,
	fetchAllVendors,
} from '../../../../services/api/productService'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './AddProductModal.module.scss'

const AddProductModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
	const [productsId, setProductsId] = useState<number>(0)
	const [accounts, setAccounts] = useState<{ value: string; label: string }[]>(
		[]
	)
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		accountId: '',
		name: '',
		description: '',
		quantity: 0,
		price: 0,
		brandId: '',
		subcategoryId: '1',
		isBonus: false,
		isFreeDelivery: false,
		isDiscount: false,
		bonus: 0,
		discount: 0,
	})

	useEffect(() => {
		if (isOpen) {
			// загрузка бренды
			const loadBrands = async () => {
				try {
					const response = await fetchBrands()
					const brandOptions = response.records.map((brand: any) => ({
						value: brand.id.toString(),
						label: brand.name,
					}))
					setBrands(brandOptions)
				} catch (error) {
					console.error('Error fetching brands:', error)
				}
			}

			// загрузка поставщики
			const loadVendors = async () => {
				try {
					const response = await fetchAllVendors()
					const vendorOptions = response.records.map((vendor: any) => ({
						value: vendor.id.toString(),
						label: vendor.firstName,
					}))
					setAccounts(vendorOptions)
				} catch (error) {
					console.error('Error fetching vendors:', error)
				}
			}

			loadBrands()
			loadVendors()
		}
	}, [isOpen])

	const handleInputChange = (field: string, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleAddProduct = async () => {
		try {
			setLoading(true)

			await addProduct({
				name: formData.name,
				description: formData.description,
				quantity: formData.quantity || 0,
				price: formData.price || 0,
				brandId: parseInt(formData.brandId, 10),
				subcategoryId: parseInt(formData.subcategoryId, 10),
				features: {
					isBonus: formData.isBonus,
					isFreeDelivery: formData.isFreeDelivery,
					isDiscount: formData.isDiscount,
					bonus: formData.bonus || 0,
					discount: formData.discount || 0,
				},
				amountPrice: 0,
				rating: 0,
			}).then(productResponse =>
				addVendorGroup({
					productId: productResponse?.id,
					vendorId: parseInt(formData.accountId, 10),
					price: formData.price.toString(),
				})
			)

			// Сразу прикрепляем продукт в поставщику

			alert('Товар успешно добавлен!')
			onClose()
		} catch (error) {
			alert('Ошибка при добавлении товара')
			console.error(error)
		} finally {
			setLoading(false)
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
				data={accounts}
				value={formData.accountId}
				onChange={value => handleInputChange('accountId', value ?? '')}
				placeholder='Выберите поставщика'
			/>
			<TextInput
				label='Название товара'
				placeholder='Введите название'
				value={formData.name}
				onChange={e => handleInputChange('name', e.currentTarget.value)}
			/>
			<TextInput
				label='Описание'
				placeholder='Введите описание'
				value={formData.description}
				onChange={e => handleInputChange('description', e.currentTarget.value)}
			/>
			<NumberInput
				label='Количество'
				placeholder='Введите количество'
				value={formData.quantity}
				onChange={value => handleInputChange('quantity', value ?? 0)}
			/>
			<NumberInput
				label='Цена'
				placeholder='Введите цену'
				value={formData.price}
				onChange={value => handleInputChange('price', value ?? 0)}
			/>
			<Select
				label='Бренд'
				data={brands}
				value={formData.brandId}
				onChange={value => handleInputChange('brandId', value ?? '')}
				placeholder='Выберите бренд'
			/>

			<Checkbox
				label='Бонусный товар'
				checked={formData.isBonus}
				onChange={e => handleInputChange('isBonus', e.currentTarget.checked)}
			/>
			<Checkbox
				label='Бесплатная доставка'
				checked={formData.isFreeDelivery}
				onChange={e =>
					handleInputChange('isFreeDelivery', e.currentTarget.checked)
				}
			/>
			<Checkbox
				label='Скидка'
				checked={formData.isDiscount}
				onChange={e => handleInputChange('isDiscount', e.currentTarget.checked)}
			/>
			<NumberInput
				label='Бонус'
				placeholder='Введите бонус'
				value={formData.bonus}
				onChange={value => handleInputChange('bonus', value ?? 0)}
			/>
			<NumberInput
				label='Скидка'
				placeholder='Введите скидку'
				value={formData.discount}
				onChange={value => handleInputChange('discount', value ?? 0)}
			/>

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
