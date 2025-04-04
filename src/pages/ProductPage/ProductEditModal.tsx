import { BaseButton } from '@components/atoms/Button/BaseButton'
import { Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { editProduct } from '@services/api/productService'
import NotificationStore from '@store/NotificationStore'
import MDEditor from '@uiw/react-md-editor'
import { useState } from 'react'
import { FormData } from './ProductPage'

type Props = {
  isOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  product: any
  formData: any
  setFormData: any
}

const ProductEditModal: React.FC<Props> = ({
  isOpen,
  setIsEditModalOpen,
  product,
  formData,
  setFormData,
}) => {
  const [brandSearch, setBrandSearch] = useState<string>('')
  const [filteredBrands, setFilteredBrands] = useState<{ value: string; label: string }[]>([])

  const handleEditProduct = async () => {
    try {
      console.log(formData)
      const response = await editProduct(product?.id, formData)
      NotificationStore.addNotification('Товар', 'Товар успешно отредактирован!', 'success')
      setIsEditModalOpen(false)

      if (response.status !== 200) {
        throw new Error('Произошла ошибка при редактировании товара!')
      }
    } catch (err) {
      NotificationStore.addNotification(
        'Товар',
        'Произошла ошибка при редактировании товара!',
        'error'
      )
      console.error('Ошибка при редактировании товара:', err)
    }
  }

  const handleInputChange = (
    field: keyof FormData | keyof NonNullable<FormData['vendorGroups'][0]['features']>,
    value: any
  ) => {
    let newValue = value
    if (field === 'bonus' || field === 'discount') {
      newValue = Math.min(100, Math.max(0, value))
    }

    setFormData((prev: FormData) => {
      // Если поле принадлежит `vendorGroups[0].features`
      if (field in (prev.vendorGroups[0].features || {})) {
        return {
          ...prev,
          vendorGroups: prev.vendorGroups.map((group, index) =>
            index === 0
              ? {
                  ...group,
                  features: {
                    ...group.features,
                    [field]: newValue,
                    isBonus: field === 'bonus' ? newValue > 0 : group.features?.isBonus,
                    isDiscount: field === 'discount' ? newValue > 0 : group.features?.isDiscount,
                  },
                }
              : group
          ),
        }
      }

      // Если поле принадлежит `FormData`
      return {
        ...prev,
        [field]: newValue,
      }
    })
  }

  return (
    <Modal opened={isOpen} withCloseButton={false} onClose={() => setIsEditModalOpen(false)}>
      <TextInput
        required
        label="Название товара"
        value={formData.name}
        onChange={e => handleInputChange('name', e.currentTarget.value)}
      />
      <label htmlFor="mdEditor">Описание</label>
      <MDEditor
        id="mdEditor"
        value={formData.description}
        onChange={value => handleInputChange('description', value)}
        height={400}
      />
      <NumberInput
        label="Количество"
        value={formData.quantity}
        onChange={value => handleInputChange('quantity', value ?? 0)}
      />
      <NumberInput
        label="Цена"
        value={formData.price}
        onChange={value => handleInputChange('price', value ?? 0)}
      />
      <Select
        label="Бренд"
        data={filteredBrands}
        searchable
        searchValue={brandSearch}
        onSearchChange={setBrandSearch}
        value={formData.brand}
        onChange={value => {
          const selectedBrand = filteredBrands.find(b => b.value === value) || null
          setFormData((prev: FormData) => ({ ...prev, brand: selectedBrand }))
        }}
        placeholder="Выберите бренд..."
      />
      <NumberInput
        label="Бонус %"
        max={100}
        value={formData.vendorGroups[0].features?.bonus}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => handleInputChange('bonus', value ?? 0)}
      />
      <NumberInput
        label="Скидка %"
        max={100}
        value={formData.vendorGroups[0].features?.discount}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => handleInputChange('discount', value ?? 0)}
      />
      <NumberInput
        label="ЕНС ТРУ"
        placeholder="Введите ЕНС ТРУ"
        value={formData.ENSTRU}
        onChange={value => handleInputChange('ENSTRU', value ?? 0)}
      />
      <NumberInput
        label="GTIN"
        value={formData.GTIN}
        placeholder="Введите GTIN"
        onChange={value => handleInputChange('GTIN', value ?? 0)}
      />
      <NumberInput
        label="KZTIN"
        placeholder="Введите KZTIN"
        value={formData.KZTIN}
        onChange={value => handleInputChange('KZTIN', value ?? 0)}
      />
      <BaseButton variantColor="primary" onClick={handleEditProduct}>
        Сохранить
      </BaseButton>
    </Modal>
  )
}

export default ProductEditModal
