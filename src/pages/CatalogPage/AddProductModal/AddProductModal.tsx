/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { fetchAllSubCategory, fetchBrands } from '@services/brandService'
import {
  addProduct,
  addVendorGroup,
  fetchAllVendors,
  uploadMultipleImages,
} from '@services/productService'
import NotificationStore from '@features/notification/model/NotificationStore'
import { BaseButton } from '@shared/ui/Button/BaseButton'
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
  const [newBonus, setNewBonus] = useState<string | number | undefined>('')
  const [newDiscount, setNewDiscount] = useState<string | number>('')
  const [subcategorySearch, setSubcategorySearch] = useState<string>('')
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
  const [accounts, setAccounts] = useState<BrandOption[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({
    accountId: isAdmin ? '' : profileData?.id?.toString() || '',
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

  const MAX_FILE_SIZE_MB = 5

  // Мемоизированная фильтрация брендов
  const filteredBrands = useMemo(() => {
    if (brandSearch.trim() === '') return brands
    const searchLower = brandSearch.toLowerCase()
    return brands.filter(brand => brand.label.toLowerCase().includes(searchLower))
  }, [brandSearch, brands])

  // Мемоизированная фильтрация категорий
  const filteredCategories = useMemo(() => {
    if (subcategorySearch.trim() === '') return categories
    const searchLower = subcategorySearch.toLowerCase()
    return categories.filter(category => category.label.toLowerCase().includes(searchLower))
  }, [subcategorySearch, categories])

  // Мемоизированные опции аккаунтов
  const accountOptions = useMemo(() => {
    return isAdmin
      ? accounts
      : [
          {
            value: profileData?.id?.toString() || '',
            label: profileData?.firstName || '',
          },
        ]
  }, [isAdmin, accounts, profileData])

  // Оптимизированный обработчик изменения файлов
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [MAX_FILE_SIZE_MB]
  )

  // Оптимизированный обработчик изменения формы
  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Обработчики для поисковых полей
  const handleBrandSearchChange = useCallback((value: string) => {
    setBrandSearch(value)
  }, [])

  const handleSubcategorySearchChange = useCallback((value: string) => {
    setSubcategorySearch(value)
  }, [])

  const handleSubcategoryChange = useCallback((value: string | null) => {
    setFormData(prev => ({ ...prev, subcategoryId: value }))
  }, [])

  const handleBrandChange = useCallback((value: string | null) => {
    setFormData(prev => ({ ...prev, brandId: value }))
  }, [])

  // Загрузка данных при открытии модалки
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

          // Бренды
          const brandOptions = brandsResponse.data.records.map((brand: any) => ({
            value: brand.id.toString(),
            label: brand.name,
          }))
          setBrands(brandOptions)

          // Поставщики
          const vendorOptions = vendorResponse.data.records.map((vendor: any) => ({
            value: vendor.id.toString(),
            label: vendor.firstName,
          }))
          setAccounts(vendorOptions)
        } catch (error) {
          console.error('Ошибка загрузки данных:', error)
        }
      }
      loadData()
    }
  }, [isOpen])

  const handleAddProduct = useCallback(async () => {
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

      if (!productResponse) return 'error'
      const productId = productResponse?.data?.id

      await uploadMultipleImages(selectedFiles, productId)

      await addVendorGroup({
        productId: productId,
        vendorId: parseInt(formData.accountId, 10),
        price: formData.price.toString(),
        features: {
          isBonus: newBonus != 0,
          isDiscount: newDiscount != 0,
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
  }, [formData, selectedFiles, newBonus, newDiscount, onClose])

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
        data={accountOptions}
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
        onSearchChange={handleSubcategorySearchChange}
        placeholder="Введите категорию..."
        value={formData.subcategoryId}
        onChange={handleSubcategoryChange}
      />

      <label htmlFor="mdEditor">Описание</label>
      <MDEditor
        id="mdEditor"
        value={formData.description}
        onChange={value => handleInputChange('description', value || '')}
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
        <input type="file" id="fileInput" multiple onChange={handleFileChange} />
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
        onSearchChange={handleBrandSearchChange}
        placeholder="Введите бренд..."
        value={formData.brandId}
        onChange={handleBrandChange}
      />

      <NumberInput
        label="Бонус %"
        max={100}
        min={0}
        placeholder="Введите бонус (0 - 100)"
        value={newBonus}
        onChange={setNewBonus}
      />

      <NumberInput
        label="Скидка %"
        max={100}
        min={0}
        placeholder="Введите скидку (0 - 100)"
        value={newDiscount}
        onChange={setNewDiscount}
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
