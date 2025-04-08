import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from 'react'
import styles from './ProductPage.module.scss'
import MDEditor from '@uiw/react-md-editor'
import { DownloadIcon } from '@assets/icons/DownloadIcon'
import { DeleteIcon } from '@assets/icons'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import NotificationStore from '@store/NotificationStore'
import baseApi from '@services/api/base'
import { Modal, TextInput } from '@mantine/core'
import { fetchGroup, uploadProductDocument } from '@services/api/productService'

const ProductTabs = ({ product }: any) => {
  const [productGroups, setProductGroups] = useState<any>([])
  const [activeTab, setActiveTab] = useState<string>('описание')
  const [errorText, setErrorText] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File[]>([])
  const [isModalOpen, setIsModalOpen] = useState<any>({
    image: false,
    document: false,
  })

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupResponse: any = await fetchGroup()
        console.log('groupresponse', groupResponse)
        setProductGroups(groupResponse.data.records)
      } catch (err) {
        console.log(err)
      }
    }

    loadGroups()
  }, [])

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

  const handleDocumentSubmit = async () => {
    if (selectedDocument.length === 0) {
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
    // If validation passes, proceed with upload
    try {
      const response: any = await uploadProductDocument(
        selectedDocument,
        product.vendorGroups[0].id
      )
      NotificationStore.addNotification('Документы', 'Документы успешно добавлены!', 'success')
      setIsModalOpen({ ...isModalOpen, document: false })
    } catch (error) {
      console.error(error)
      NotificationStore.addNotification(
        'Документы',
        'Произошла ошибка при добавлении документа!',
        'error'
      )
      setIsModalOpen({ ...isModalOpen, document: false })
    }
  }

  const downloadFile = async (url: string, customFileName: string) => {
    try {
      const response: any = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }
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

  return (
    <div className={styles.tabs}>
      <ul>
        <li
          className={activeTab === 'описание' ? styles.active : ''}
          onClick={() => setActiveTab('описание')}
        >
          Описание
        </li>

        <li
          className={activeTab === 'Документы' ? styles.active : ''}
          onClick={() => setActiveTab('Документы')}
        >
          Документы
        </li>
        <li
          className={activeTab === 'Группы' ? styles.active : ''}
          onClick={() => setActiveTab('Группы')}
        >
          Группы
        </li>
      </ul>

      {activeTab === 'описание' && (
        <div id="description" style={{ padding: '20px' }}>
          <MDEditor.Markdown source={product.description} style={{ whiteSpace: 'pre-wrap' }} />
        </div>
      )}

      {activeTab === 'Документы' && (
        <div className={styles.tabBody}>
          <ul className="flex ">
            {product.vendorGroups[0].productDocuments.map((productDocument: any) => (
              <li className={styles.productDocumentsItem} key={productDocument.id}>
                {productDocument.originalname.split('.')[0].length >= 35
                  ? productDocument.originalname.split('.')[0].substring(0, 35) + '...'
                  : productDocument.originalname.split('.')[0]}
                <div className={styles.documentAction}>
                  <a
                    onClick={() => downloadFile(productDocument.url, productDocument.originalname)}
                  >
                    <DownloadIcon />
                  </a>

                  <a href="#" onClick={() => handleDeleteDocument(productDocument.filename)}>
                    <DeleteIcon />
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <BaseButton
            variantColor="primary"
            onClick={() => setIsModalOpen({ ...isModalOpen, document: true })}
          >
            Добавить документ
          </BaseButton>
        </div>
      )}

      {activeTab === 'Группы' && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {productGroups.map((group: { id: number; title: any; groupItems: any }) => (
            <div
              style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
              key={group.id}
            >
              {group.title}:
              <div style={{ display: 'flex', gap: '10px' }}>
                {group.groupItems.map((subGroup: { id: number; value: any }) => (
                  <button
                    className={styles.group}
                    key={subGroup.id}
                    onClick={() => console.log(group)}
                  >
                    {subGroup.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        opened={isModalOpen.document}
        onClose={() => setIsModalOpen({ ...isModalOpen, document: false })}
        withCloseButton={false}
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
    </div>
  )
}

export default ProductTabs
