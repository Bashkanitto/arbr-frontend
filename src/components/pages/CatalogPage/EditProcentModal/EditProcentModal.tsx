import { Checkbox, Modal, Select, Slider } from '@mantine/core'
import { useState } from 'react'
import { updateBonus } from '../../../../services/api/procentService'
import NotificationStore from '../../../../store/NotificationStore'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './EditProcentModal.module.scss'

interface EditProcentModalProps {
	isOpen: boolean
	onClose: () => void
	user: any
}

const EditProcentModal = ({ isOpen, onClose, user }: EditProcentModalProps) => {
	const [sliderValue, setSliderValue] = useState<number>(0)
	const [bonus, setBonus] = useState<number>(0)
	const [error, setError] = useState<string>('')
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null
	) // Allow null as initial state
	const [isApplyToAll, setIsApplyToAll] = useState<boolean>(false)

	const handleSave = async () => {
		if (selectedProductId !== null) {
			try {
				await updateBonus(selectedProductId, sliderValue)
				NotificationStore.addNotification(
					'Изменение процента',
					'Процент успешно изменен',
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
		} else {
			console.error('No product selected')
			setError('Выберите продукт')
		}
	}

	const handleSliderChange = (value: number) => {
		setSliderValue(value)
		setBonus(value)
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
			<p className={styles.bonus}>Процент {bonus}%</p>
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
