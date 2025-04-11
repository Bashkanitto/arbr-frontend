import { DeleteIcon } from '@assets/icons'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import NotificationStore from '@store/NotificationStore'
import styles from '../ProductPage.module.scss'
import baseApi from '@services/api/base'
import { DownloadIcon } from '@assets/icons/DownloadIcon'
import { Modal, TextInput } from '@mantine/core'
import { useState } from 'react'
import { uploadProductDocument } from '@services/api/productService'

const DocumentTab = ({ product }) => {
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<boolean>(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File[]>([])

  const handleDeleteDocument = async (filename: string) => {
    try {
      await baseApi.delete(`/upload/${filename}`)
      NotificationStore.addNotification('Документы', 'Документы успешно уделен!', 'success')
    } catch (err) {
      console.error(err)
      NotificationStore.addNotification(
        'Документы',
        'Произошла ошибка при удалении документа!',
        'error'
      )
    }
  }

  const downloadFile = async (url: string, customFileName: string) => {
    try {
      const response: any = await fetch(url)
      const blob = await response.data.blob()
      const link = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      link.href = objectUrl
      link.download = `${customFileName.split('.')[0]}.xlsx`
      link.click()
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Error while downloading file:', error)
    }
  }

  const handleDocumentSubmit = async () => {
    if (selectedDocument.length <= 0) {
      setErrorText('Выберите файл')
      return
    }
    setErrorText(null)
    const allowedExtensions = ['xlsx', 'pdf']
    for (const file of selectedDocument) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!ext || !allowedExtensions.includes(ext)) {
        NotificationStore.addNotification(
          'Документы',
          'Неверный формат файла. Допустимы только файлы с расширением .xlsx или .pdf.',
          'error'
        )
        return
      }
    }
    try {
      await uploadProductDocument(selectedDocument, product.vendorGroups[0].id)
      NotificationStore.addNotification('Документы', 'Документы успешно добавлены!', 'success')
      setIsDocumentModalOpen(false)
    } catch (error) {
      console.error(error)
      NotificationStore.addNotification(
        'Документы',
        'Произошла ошибка при добавлении документа!',
        'error'
      )
      setIsDocumentModalOpen(false)
    }
  }

  return (
    <div className={styles.tabBody}>
      <ul className="flex">
        {product.vendorGroups[0].productDocuments.map(doc => (
          <li className={styles.productDocumentsItem} key={doc.id}>
            {doc.originalname}
            <div className={styles.documentAction}>
              <a onClick={() => downloadFile(doc.url, doc.originalname)}>
                <DownloadIcon />
              </a>
              <a onClick={() => handleDeleteDocument(doc.filename)}>
                <DeleteIcon />
              </a>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        withCloseButton={false}
        opened={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
      >
        <TextInput
          type="file"
          onChange={event =>
            event.target.files && setSelectedDocument(Array.from(event.target.files))
          }
        />
        <p style={{ color: 'grey', margin: '10px 0' }}>Допустимые форматы: xlsx, pdf</p>
        {errorText && <p style={{ color: 'red' }}>{errorText}</p>}
        <BaseButton style={{ width: '100%' }} variantColor="primary" onClick={handleDocumentSubmit}>
          Отправить
        </BaseButton>
      </Modal>
      <BaseButton variantColor="primary" onClick={() => setIsDocumentModalOpen(true)}>
        Добавить документ
      </BaseButton>
    </div>
  )
}

export default DocumentTab
