/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Modal, Select, Slider } from '@mantine/core'
import { useState } from 'react'
import { updateDiscount } from '@services/api/procentService'
import NotificationStore from '@store/NotificationStore'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import styles from './DiscountModal.module.scss'
import { fetchProductById } from '@services/api/productService'

interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

const DiscountModal = ({ isOpen, onClose, user }: DiscountModalProps) => {
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [userPrice, setUserPrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const [vendorGroupId, setVendorGroupId] = useState<number | null>(null)
  const [isApplyToAll, setIsApplyToAll] = useState<boolean>(false)

  const handleSave = async () => {
    if (vendorGroupId !== null) {
      try {
        await updateDiscount(vendorGroupId, sliderValue)
        onClose()
        NotificationStore.addNotification(
          'Изменение скидки',
          `Скидка для продукта c номером ${vendorGroupId}  успешно изменен`,
          'success'
        )
      } catch (error) {
        console.error('Error updating discount:', error)
        NotificationStore.addNotification('Изменение скидки', 'Что то пошло не так', 'error')
      }
    } else {
      console.error('No product selected')
      setError('Выберите продукт')
    }
  }

  const handleSliderChange = (value: number) => {
    setSliderValue(value)
    setDiscount(Number((userPrice * (value / 100)).toFixed(2)))
  }

  const handleSelectChange = async (value: string | null) => {
    const productId = Number(value)

    try {
      const response: any = await fetchProductById(productId)

      const discountValue = response.data.vendorGroups[0].features?.discount || 0
      setVendorGroupId(response.data.vendorGroups[0].id)
      setSliderValue(discountValue)
      setUserPrice(response.data.price)
      setDiscount(response.data.price * (discountValue / 100))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal className={styles['Discount-modal']} opened={isOpen} onClose={onClose}>
      <Select
        placeholder="Выберите товар"
        onChange={handleSelectChange}
        data={user.vendorGroups.map((group: any) => ({
          value: String(group.product.id),
          label: group.product.name,
        }))}
      />
      {error && <p className="danger">{error}</p>}
      <div className={styles['checkbox']}>
        <Checkbox
          size="xs"
          checked={isApplyToAll}
          onChange={e => setIsApplyToAll(e.target.checked)}
        />
        Применить ко всем товарам
      </div>
      <Slider color="blue" value={sliderValue} onChange={handleSliderChange} min={0} max={100} />
      <p className={styles.bonus}>Скидка {discount}₸</p>
      <BaseButton
        onClick={handleSave}
        className={styles['DiscountModal-button']}
        variantColor="primary"
      >
        Сохранить
      </BaseButton>
    </Modal>
  )
}

export default DiscountModal
