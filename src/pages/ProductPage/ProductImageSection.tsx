import { useState } from 'react'
import { BaseButton } from '@shared/ui/Button/BaseButton'
import NotificationStore from '@features/notification/model/NotificationStore'
import styles from './ProductPage.module.scss'
import baseApi from '@services/base'
import FullViewImageModal from '@components/molecules/FullViewImageModal/FullViewImageModal'
import ProductTabs from './productTabs/index'
import { wait } from '@shared/utils/wait'
import { Modal, TextInput } from '@mantine/core'
import { fetchProductById, uploadMultipleImages } from '@services/productService'
import { Box } from '@shared/ui/Box'

const ProductImageSection = ({ product, id, setProduct }: any) => {
  const [selectedImage, setSelectedImage] = useState<File[]>([])
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false)
  const [viewImage, setViewImage] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<any>({
    image: false,
    document: false,
  })

  function openViewModal(imageUrl: string) {
    setViewImage(imageUrl)
    setIsViewModalOpen(true)
  }

  const handleUploadImage = async () => {
    if (selectedImage.length === 0) {
      NotificationStore.addNotification('Ошибка', 'Выберите изображение', 'error')
      return
    }
    const allowedExtensions = ['jpg', 'jpeg', 'png']
    for (const file of selectedImage) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!ext || !allowedExtensions.includes(ext)) {
        NotificationStore.addNotification('Ошибка', 'Допустимые форматы: jpg, png', 'error')
        return
      }
    }

    try {
      const imageResponse = await uploadMultipleImages(selectedImage, product.id)
      if (!imageResponse) {
        NotificationStore.addNotification(
          'Ошибка',
          'файл слишком большой или проблемы с сервером',
          'error'
        )
      } else {
        NotificationStore.addNotification('Успех', 'Изображение загружено!', 'success')
      }

      const response: any = await fetchProductById(id)
      setProduct(response?.data)
      setIsModalOpen({ ...isModalOpen, image: false })
    } catch (err) {
      console.log(err)
    } finally {
      setSelectedImage([])
    }
  }

  const handleDeleteImage = async (filename: string) => {
    try {
      await baseApi.delete(`/upload/${filename}`)
      NotificationStore.addNotification('Изображение', 'Изображение успешно удалено!', 'success')
      wait(1000).then(() => window.location.reload())
    } catch (err) {
      NotificationStore.addNotification(
        'Изображение',
        'Произошла ошибка при удалении изображения!',
        'error'
      )
    }
  }

  return (
    <Box className={styles['product-image']}>
      {product.images?.map((image: any) => (
        <div key={image.id} style={{ position: 'relative' }}>
          <img
            onClick={() => openViewModal(image.url)}
            style={{ cursor: 'pointer' }}
            src={image.url.replace('http://3.76.32.115:3000', 'https://api.arbr.kz')}
          />
          <div className={styles.deleteIcon} onClick={() => handleDeleteImage(image.filename)}>
            X
          </div>
        </div>
      ))}

      {product.youtubeVideoUrl && (
        <iframe
          width="600"
          height="400"
          src={product.youtubeVideoUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      <BaseButton onClick={() => setIsModalOpen({ ...isModalOpen, image: true })}>
        Добавить фото
      </BaseButton>

      <ProductTabs product={product} />

      <Modal
        withCloseButton={false}
        opened={isModalOpen.image}
        onClose={() => setIsModalOpen({ ...isModalOpen, image: false })}
      >
        <TextInput
          type="file"
          onChange={e => setSelectedImage(e.target.files ? Array.from(e.target.files) : [])}
          multiple
        />
        <p style={{ color: 'grey', margin: '10px 0' }}>Допустимые форматы: jpg, png</p>
        <BaseButton variantColor="primary" onClick={handleUploadImage}>
          Загрузить
        </BaseButton>
      </Modal>

      <FullViewImageModal
        imageUrl={viewImage}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </Box>
  )
}

export default ProductImageSection
