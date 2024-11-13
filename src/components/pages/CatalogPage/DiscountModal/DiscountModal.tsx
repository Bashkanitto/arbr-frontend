import { Checkbox, Modal, Select, Slider } from '@mantine/core'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './DiscountModal.module.scss'

interface DiscountModal {
	isOpen: boolean
	onClose: () => void
}

const DiscountModal = ({ isOpen, onClose }: DiscountModal) => {
	return (
		<Modal
			className={styles['DiscountModal-modal']}
			opened={isOpen}
			onClose={onClose}
		>
			<Select
				placeholder='Выберите товар'
				data={[
					{ value: 'Перчатки', label: 'Перчатки' },
					{ value: 'Белизна', label: 'Белизна' },
				]}
			/>
			<div className={styles['checkbox']}>
				<Checkbox size='xs' /> Применить ко всем товарам
			</div>
			<p className={styles['procent']}>Укажите процент скидки</p>
			<Slider color='blue' />
			<BaseButton
				className={styles['DiscountModal-button']}
				variantColor='primary'
			>
				Сохранить
			</BaseButton>
		</Modal>
	)
}

export default DiscountModal
