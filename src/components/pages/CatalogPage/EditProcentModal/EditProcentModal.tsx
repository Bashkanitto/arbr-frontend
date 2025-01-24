/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Modal, Select, Slider } from '@mantine/core'
import { useState } from 'react'
import { updateBonus } from '../../../../services/api/procentService'
import NotificationStore from '../../../../store/NotificationStore'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './EditProcentModal.module.scss'
import { fetchProductById } from '../../../../services/api/productService'

interface EditProcentModalProps {
	isOpen: boolean
	onClose: () => void
	user: any
}

const EditProcentModal = ({ isOpen, onClose, user }: EditProcentModalProps) => {
	const [sliderValue, setSliderValue] = useState<number>(0)
	const [bonus, setBonus] = useState<number>(0)
	const [userPrice, setUserPrice] = useState<number>(0)
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null
	)
	const [isApplyToAll, setIsApplyToAll] = useState<boolean>(false)

	const handleSave = async () => {
		try {
			await updateBonus(selectedProductId, sliderValue)
			NotificationStore.addNotification(
				'Изменение процента',
				`Процент для продукта c номером ${selectedProductId} успешно изменен`,
				'success'
			)
			onClose()
		} catch (error) {
			console.error('Error updating bonus:', error)
			NotificationStore.addNotification(
				'Изменение процента',
				'Что то пошло не так',
				'error'
			)
		}
	}

	const handleSliderChange = (value: number) => {
		setSliderValue(value)
		setBonus(Number((userPrice * (value / 100)).toFixed(2)))
	}

	const handleSelectChange = async (value: string | null) => {
		const productId = Number(value)

		try {
			const response: any = await fetchProductById(productId)
			setSelectedProductId(productId)
			setSliderValue(response.features?.bonus || 0)
			setUserPrice(response.price)
			setBonus(response.price * (response.features?.bonus / 100))
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Modal
			className={styles['EditProcent-modal']}
			opened={isOpen}
			onClose={onClose}
		>
			<Select
				placeholder='Выберите товар'
				onChange={handleSelectChange}
				data={user.vendorGroups.map((group: any) => ({
					value: String(group.product.id),
					label: group.product.name,
				}))}
			/>
			<div className={styles['checkbox']}>
				<Checkbox
					size='xs'
					checked={isApplyToAll}
					onChange={e => setIsApplyToAll(e.target.checked)}
				/>
				Применить ко всем товарам
			</div>
			<Slider
				color='blue'
				value={sliderValue}
				onChange={handleSliderChange}
				min={0}
				max={100}
			/>
			<p className={styles.bonus}>Процент {bonus}₸ </p>
			<BaseButton
				onClick={handleSave}
				className={styles['editProcent-button']}
				variantColor='primary'
			>
				Сохранить
			</BaseButton>
		</Modal>
	)
}

export default EditProcentModal
