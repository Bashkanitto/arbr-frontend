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
  KZTIN: string | null
  GTIN: string | null
  ENSTRU: string | null
  brandId: string | null
  subcategoryId: string | null
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
  const [newBonus, setNewBonus] = useState<string | number | null>('')
  const [newDiscount, setNewDiscount] = useState<string | number>('')
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
    brandId: null,
    KZTIN: null,
    GTIN: null,
    ENSTRU: null,
    subcategoryId: null,
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
          const categoryOptions = categoriesResponse.data.records.map((category: any) => ({
            value: category.id.toString(),
            label: category.name,
          }))
          setCategories(categoryOptions)
          setFilteredCategories(categoryOptions)

          // Бренды
          const brandOptions = brandsResponse.data.records.map((brand: any) => ({
            value: brand.id.toString(),
            label: brand.name,
          }))
          setBrands(brandOptions)
          setFilteredBrands(brandOptions)

          // Поставщики
          const vendorOptions = vendorResponse.data.records.map((vendor: any) => ({
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
    setFormData(prev => ({
      ...prev,
      [field]: newValue,
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
        KZTIN: formData.KZTIN,
        GTIN: formData.GTIN,
        ENCTRU: formData.ENSTRU,
        brandId: formData.brandId,
        subcategoryId: formData.subcategoryId || 1,
        amountPrice: 0,
        rating: 0,
      })

      if (!productResponse) return 'erore'
      const productId = productResponse?.data?.id

      await uploadMultipleImages(selectedFiles, productId)

      await addVendorGroup({
        productId: productId,
        vendorId: parseInt(formData.accountId, 10),
        price: formData.price.toString(),
        features: {
          isBonus: newBonus != 0,
          isDiscount: newBonus != 0,
          bonus: newBonus,
          discount: newDiscount,
        },
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
        }
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
        value={formData.subcategoryId}
        onChange={value => {
          setFormData(prev => ({ ...prev, subcategoryId: value }))
        }}
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
        data={filteredBrands}
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
        onChange={value => setNewBonus(value)}
      />
      <NumberInput
        label="Скидка %"
        max={100}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        onChange={value => setNewDiscount(value)}
      />
      <TextInput
        label="KZTIN"
        placeholder="Введите KZTIN"
        value={formData.KZTIN ?? ''}
        onChange={e => handleInputChange('KZTIN', e.currentTarget.value)}
      />

      <TextInput
        label="ЕНС ТРУ"
        placeholder="Введите ЕНС ТРУ"
        value={formData.ENSTRU ?? ''}
        onChange={e => handleInputChange('ENSTRU', e.currentTarget.value)}
      />

      <TextInput
        label="GTIN"
        placeholder="Введите GTIN"
        value={formData.GTIN ?? ''}
        onChange={e => handleInputChange('GTIN', e.currentTarget.value)}
      />

      {error && <p className="danger">{error}</p>}
      <BaseButton
        style={{
          width: '100%',
          marginTop: '10px',
        }}
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
