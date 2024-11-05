import { Checkbox, Modal, Select, Slider } from '@mantine/core'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './EditProcentModal.module.scss'

const bonus = 0

interface EditProcentModalProps {
	isOpen: boolean
	onClose: () => void
}

const EditProcentModal = ({ isOpen, onClose }: EditProcentModalProps) => {
	return (
		<Modal
			className={styles['EditProcent-modal']}
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
			<p className={styles['procent']}>Укажите процент</p>
			<Slider color='blue' />
			<p>Бонус {bonus}₸</p>
			<BaseButton
				className={styles['editProcent-button']}
				variantColor='primary'
			>
				Сохранить
			</BaseButton>
		</Modal>
	)
}

export default EditProcentModal
