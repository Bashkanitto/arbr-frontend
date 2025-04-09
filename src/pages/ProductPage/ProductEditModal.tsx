import { BaseButton } from '@components/atoms/Button/BaseButton'
import { Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { editProduct } from '@services/api/productService'
import NotificationStore from '@store/NotificationStore'
import MDEditor from '@uiw/react-md-editor'
import { useEffect, useState } from 'react'
import { FormData } from './ProductPage'
import { updateBonus, updateDiscount } from '@services/api/procentService'
import { fetchBrands } from '@services/api/brandService'

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
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [newBonus, setNewBonus] = useState<string | number>(
    product?.vendorGroups[0].features?.bonus
  )
  const [newDiscount, setNewDiscount] = useState<string | number>(
    product.vendorGroups[0].feature?.discount
  )
  const [brandSearch, setBrandSearch] = useState<string>('')
  const [filteredBrands, setFilteredBrands] = useState<{ value: string; label: string }[]>([])

  const handleEditProduct = async () => {
    try {
      const response = await editProduct(product?.id, formData)
      // TODO
      await updateBonus(product.vendorGroups[0]?.id, newBonus)
      // TODO
      await updateDiscount(product.vendorGroups[0]?.id, newDiscount)
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

  const handleInputChange = async (field: keyof FormData, value: any) => {
    setFormData((prev: FormData) => {
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  useEffect(() => {
    const loadData = async () => {
      const brandsResponse: any = await fetchBrands()
      const brandOptions = brandsResponse.data.records.map((brand: any) => ({
        value: brand.id.toString(),
        label: brand.name,
      }))
      setBrands(brandOptions)
      setFilteredBrands(brandOptions)
    }

    loadData()
  }, [])

  useEffect(() => {
    const filtered =
      brandSearch.trim() === ''
        ? brands
        : brands.filter(brand => brand.label.toLowerCase().includes(brandSearch.toLowerCase()))
    setFilteredBrands(filtered)
  }, [brandSearch, brands])

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
        defaultValue={formData.brand}
        placeholder="Выберите бренд..."
      />
      <NumberInput
        label="Бонус %"
        max={100}
        value={formData.vendorGroups[0].features?.bonus}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => setNewBonus(value)}
      />
      <NumberInput
        label="Скидка %"
        max={100}
        value={formData.vendorGroups[0].features?.discount}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => setNewDiscount(value)}
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
