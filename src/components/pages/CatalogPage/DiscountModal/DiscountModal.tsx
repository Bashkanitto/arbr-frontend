import { Checkbox, Modal, Select, Slider } from '@mantine/core'
import { useState } from 'react'
import { updateDiscount } from '../../../../services/api/procentService'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './DiscountModal.module.scss'

interface DiscountModalProps {
	isOpen: boolean
	onClose: () => void
	user: any
}

const EditProcentModal = ({ isOpen, onClose, user }: DiscountModalProps) => {
	const [sliderValue, setSliderValue] = useState<number>(0)
	const [discount, setDiscount] = useState<number>(0)
	const [error, setError] = useState<string>('')
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null
	)
	const [isApplyToAll, setIsApplyToAll] = useState<boolean>(false)

	const handleSave = async () => {
		if (selectedProductId !== null) {
			try {
				await updateDiscount(selectedProductId, sliderValue)
				onClose()
			} catch (error) {
				console.error('Error updating bonus:', error)
			}
		} else {
			console.error('No product selected')
			setError('Выберите продукт')
		}
	}

	const handleSliderChange = (value: number) => {
		setSliderValue(value)
		setDiscount(value)
	}

	const handleSelectChange = (value: string | null) => {
		if (value !== null) {
			setError('')
			setSelectedProductId(Number(value))
		} else {
			setSelectedProductId(null)
		}
	}

	return (
		<Modal
			className={styles['Discount-modal']}
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
			{error && <p className='danger'>{error}</p>}
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
			<p className={styles.bonus}>Скидка {discount}%</p>
			<BaseButton
				onClick={handleSave}
				className={styles['DiscountModal-button']}
				variantColor='primary'
			>
				Сохранить
			</BaseButton>
		</Modal>
	)
}

export default EditProcentModal
