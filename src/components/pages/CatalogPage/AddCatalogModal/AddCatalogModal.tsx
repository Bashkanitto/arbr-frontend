import { Modal, TextInput } from '@mantine/core'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './AddCatalogModal.module.scss'

const AddCatalogModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: unknown
}) => {
	return (
		<Modal
			className={styles['addCatalog-modal']}
			opened={isOpen}
			onClose={onClose}
			title='Добавьте Товар'
		>
			<TextInput type='file' />
			<p style={{ color: 'grey' }}>Допустимые форматы: xlx, pdf, samsa</p>
			<BaseButton
				className={styles['AddCatalog-button']}
				variantColor='primary'
			>
				Добавить Каталог
			</BaseButton>
		</Modal>
	)
}

export default AddCatalogModal
