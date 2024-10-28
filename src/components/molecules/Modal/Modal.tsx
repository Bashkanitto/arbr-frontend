import { Button, Modal, TextInput } from '@mantine/core'
import { useState } from 'react'

type EditModalProps = {
	isOpen: boolean
	onClose: () => void
	item: {
		id: number
		customer: string
		status: string
		sum: string
		date: Date
	}
	onSave: (updatedItem: {
		id: number
		customer: string
		status: string
		sum: string
		date: Date
	}) => void
}

export const ModalWindow = ({
	isOpen,
	onClose,
	item,
	onSave,
}: EditModalProps) => {
	const [formData, setFormData] = useState(item)

	const handleChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleSave = () => {
		onSave(formData)
		onClose()
	}

	return (
		<Modal opened={isOpen} onClose={onClose} title='Edit Item'>
			<TextInput
				label='Customer'
				value={formData.customer}
				onChange={e => handleChange('customer', e.target.value)}
			/>
			<TextInput
				label='Sum'
				value={formData.sum}
				onChange={e => handleChange('sum', e.target.value)}
			/>
			<Button onClick={handleSave}>Save Changes</Button>
		</Modal>
	)
}
