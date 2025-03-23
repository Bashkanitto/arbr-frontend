/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchAllSubCategory, fetchBrands } from '@services/api/brandService'
import {
  addProduct,
  addVendorGroup,
  fetchAllVendors,
  uploadMultipleImages,
} from '@services/api/productService'
import NotificationStore from '@store/NotificationStore'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import styles from './AddProductModal.module.scss'
import MDEditor from '@uiw/react-md-editor'

interface BrandOption {
  value: string
  label: string
}

interface FormData {
  accountId: string
  name: string
  description: string
  quantity: number
  price: number
  brandId: string
  subcategoryId: number
  isBonus: boolean
  isFreeDelivery: boolean
  isDiscount: boolean
  bonus: null | number
  discount: null | number
}

const AddProductModal = ({
  isOpen,
  onClose,
  isAdmin = true,
  profileData,
}: {
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
  profileData?: any
}) => {
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [brandSearch, setBrandSearch] = useState<string>('')
  const [filteredBrands, setFilteredBrands] = useState<{ value: string; label: string }[]>([])

  const [subcategorySearch, setSubcategorySearch] = useState<string>('')
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
  const [filteredCategories, setFilteredCategories] = useState<{ value: string; label: string }[]>(
    []
  )

  const [accounts, setAccounts] = useState<BrandOption[]>([])

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({
    accountId: isAdmin ? '' : profileData.id.toString(),
    name: '',
    description: '',
    quantity: 1,
    price: 0,
    brandId: '',
    subcategoryId: 0,
    isBonus: false,
    isFreeDelivery: false,
    isDiscount: false,
    bonus: null,
    discount: null,
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024)

      if (oversizedFiles.length > 0) {
        setError(`Файл(ы) превышают ${MAX_FILE_SIZE_MB}MB`)
        return
      }

      setSelectedFiles(files)
      setError('')
    }
  }

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [categoriesResponse, brandsResponse, vendorResponse]: any = await Promise.all([
            fetchAllSubCategory(),
            fetchBrands(),
            fetchAllVendors(),
          ])

          // Категории
          const categoryOptions = categoriesResponse.records.map((category: any) => ({
            value: category.id.toString(),
            label: category.name,
          }))
          setCategories(categoryOptions)
          setFilteredCategories(categoryOptions)

          // Бренды
          const brandOptions = brandsResponse.records.map((brand: any) => ({
            value: brand.id.toString(),
            label: brand.name,
          }))
          setBrands(brandOptions)
          setFilteredBrands(brandOptions)

          // Поставщики
          const vendorOptions = vendorResponse.records.map((vendor: any) => ({
            value: vendor.id.toString(),
            label: vendor.firstName,
          }))
          setAccounts(vendorOptions)
        } catch (error) {
          console.error('Ошибка загрузки поставщиков:', error)
        }
      }
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    if (subcategorySearch.trim() === '') {
      setFilteredCategories(categories)
    } else {
      setFilteredCategories(
        categories.filter(category =>
          category.label.toLowerCase().includes(subcategorySearch.toLowerCase())
        )
      )
    }
  }, [subcategorySearch, categories])

  useEffect(() => {
    setFilteredBrands(
      brandSearch.trim() === ''
        ? brands
        : brands.filter(brand => brand.label.toLowerCase().includes(brandSearch.toLowerCase()))
    )
  }, [brandSearch, brands])

  const handleInputChange = (field: keyof FormData, value: any) => {
    // Преобразуем значение в число и ограничиваем его максимумом 100, если это бонус или скидка
    let newValue = value

    if (field === 'bonus' || field === 'discount') {
      newValue = Math.min(100, Math.max(0, value))
    }

    setFormData(prev => ({
      ...prev,
      [field]: newValue,
      isBonus: field === 'bonus' ? newValue > 0 : prev.isBonus,
      isDiscount: field === 'discount' ? newValue > 0 : prev.isDiscount,
    }))
  }

  const MAX_FILE_SIZE_MB = 5

  const handleAddProduct = async () => {
    setError('')

    if (!formData.accountId) {
      setError('Выберите поставщика')
      return
    }
    if (!formData.name) {
      setError('Выберите название товара')
      return
    }
    if (!formData.price) {
      setError('Выберите цену товара')
      return
    }
    if (selectedFiles.length === 0) {
      setError('Загрузите хотя бы одно изображение')
      return
    }

    try {
      setLoading(true)
      const productResponse: any = await addProduct({
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity || 0,
        price: formData.price || 0,
        brandId: parseInt(formData.brandId, 10),
        subcategoryId: formData.subcategoryId || 1,
        features: {
          isBonus: formData.isBonus,
          isFreeDelivery: formData.isFreeDelivery,
          isDiscount: formData.isDiscount,
          bonus: formData.bonus || null,
          discount: formData.discount || null,
        },
        amountPrice: 0,
        rating: 0,
      })

      const productId = productResponse.id

      await uploadMultipleImages(selectedFiles, productId)

      await addVendorGroup({
        productId: productId,
        vendorId: parseInt(formData.accountId, 10),
        price: formData.price.toString(),
      })

      NotificationStore.addNotification(
        'Добавление товара',
        `Товар c номером ${productId} успешно добавлен`,
        'success'
      )
    } catch (error) {
      NotificationStore.addNotification('Добавление товара', 'Что-то пошло не так', 'error')
      console.error('Ошибка:', error)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Modal
      className={styles['addCatalog-modal']}
      opened={isOpen}
      onClose={onClose}
      title="Добавьте Товар"
    >
      <Select
        label="Поставщик"
        required
        disabled={!isAdmin}
        data={
          isAdmin
            ? accounts
            : [
                {
                  value: profileData.id.toString(),
                  label: profileData.firstName,
                },
              ]
        } // Wrap the profileData.id in an object
        value={formData.accountId}
        onChange={value => handleInputChange('accountId', value ?? '')}
        placeholder="Выберите имя поставщика"
      />
      <TextInput
        required
        label="Название товара"
        value={formData.name}
        onChange={e => handleInputChange('name', e.currentTarget.value)}
      />
      <Select
        label="Категории"
        data={filteredCategories}
        searchable
        searchValue={subcategorySearch}
        onSearchChange={setSubcategorySearch}
        placeholder="Введите категорию..."
        value={formData.subcategoryId.toString()}
        onChange={value => {
          setFormData(prev => ({ ...prev, subcategoryId: Number(value) }))
        }}
      />
      <label style={{ fontSize: '14px', fontWeight: '500' }} htmlFor="mdEditor">
        Характеристики
      </label>
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
      <div className={styles.fileUpload}>
        <label htmlFor="fileInput" className={styles.uploadButton}>
          Загрузить файлы (Макс {MAX_FILE_SIZE_MB}MB)
        </label>
        <input required type="file" id="fileInput" multiple onChange={handleFileChange} />
        <span className={styles.fileInfo}>
          {selectedFiles.length > 0
            ? `${selectedFiles.length} файл(ов) выбрано`
            : 'Файлы не выбраны'}
        </span>
      </div>
      <Select
        label="Бренд"
        data={filteredBrands} // Фильтрованный список
        searchable
        searchValue={brandSearch}
        onSearchChange={setBrandSearch}
        placeholder="Введите бренд..."
      />
      <NumberInput
        label="Бонус %"
        max={100}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => handleInputChange('bonus', value ?? 0)}
      />
      <NumberInput
        label="Скидка %"
        max={100}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => handleInputChange('discount', value ?? 0)}
      />
      {error && <p className="danger">{error}</p>}
      <BaseButton
        className={styles['AddCatalog-button']}
        variantColor="primary"
        onClick={handleAddProduct}
        disabled={loading}
      >
        {loading ? 'Добавление...' : 'Добавить Товар'}
      </BaseButton>
    </Modal>
  )
}

export default AddProductModal
