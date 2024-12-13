import { Modal, TextInput } from '@mantine/core'
import { useState } from 'react'
import { sendCatalogList } from '../../../../services/api/productService'
import { BaseButton } from '../../../atoms/Button/BaseButton'
import styles from './AddCatalogModal.module.scss'

const AddCatalogModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	const [file, setFile] = useState<File | null>(null)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFile(event.target.files[0])
		}
	}

	const handleSubmit = async () => {
		if (file) {
			try {
				await sendCatalogList(file)
				onClose()
			} catch (error) {
				console.error(error)
			}
		}
	}

	return (
		<Modal
			className={styles['addCatalog-modal']}
			opened={isOpen}
			onClose={onClose}
			title='Добавьте Товар'
		>
			<TextInput type='file' onChange={handleFileChange} />
			<p style={{ color: 'grey' }}>Допустимые форматы: xlx, pdf, samsa</p>
			<BaseButton
				className={styles['AddCatalog-button']}
				variantColor='primary'
				onClick={handleSubmit}
			>
				Добавить Каталог
			</BaseButton>
		</Modal>
	)
}

export default AddCatalogModal
