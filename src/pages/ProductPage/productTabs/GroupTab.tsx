import { deleteGroup, editGroup, fetchGroup } from '@services/api/productService'
import { useEffect, useState } from 'react'
import styles from '../ProductPage.module.scss'
import { DeleteIcon, EditIcon } from '@shared/icons'
import NotificationStore from '@features/notification/model/NotificationStore'
import { Modal, TextInput } from '@mantine/core'
import { BaseButton } from '@shared/ui/Button/BaseButton'
import baseApi from '@services/api/base'
import { wait } from '@shared/utils/wait'

interface GroupItem {
  id?: number
  value: string
  productId: string | number
  product?: { id: number }
}

interface Group {
  id: number
  title: string
  groupItems: GroupItem[]
}

const GroupTab = ({ productId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [group, setGroup] = useState<Group | undefined>()
  const [productGroups, setProductGroups] = useState<Group[]>([])
  const [errorText, setErrorText] = useState('')
  const [formData, setFormData] = useState<{ title: string; items: GroupItem[] }>({
    title: '',
    items: [{ value: '', productId: productId }],
  })

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupResponse: any = await fetchGroup()
        setProductGroups(groupResponse.data.records)
      } catch (err) {
        console.log(err)
      }
    }
    loadGroups()
  }, [])

  async function handleEditGroup() {
    if (
      !formData.title.trim() ||
      formData.items.some(item => !item.value.trim() || !item.productId?.toString().trim())
    ) {
      setErrorText('Заполните все поля')
      return
    }

    try {
      await editGroup(String(group?.id), {
        title: formData.title,
        items: formData.items,
      })

      NotificationStore.addNotification('Группа', 'Группа успешно обновлена:', 'success')
      setIsModalOpen(false)
      setFormData({ title: '', items: [{ value: '', productId: productId }] })
      wait(1000).then(() => window.location.reload())
    } catch (err) {
      console.error(err)
      setErrorText('Ошибка при сохранении')
      NotificationStore.addNotification('Группа', 'Произошла ошибка:', 'error')
    }
  }

  const handleDeleteGroup = async groupId => {
    try {
      await deleteGroup(groupId)
      NotificationStore.addNotification('Группы', 'Группа удачно удалена', 'success')
      const groupResponse: any = await fetchGroup()
      setProductGroups(groupResponse.data.records)
    } catch (err) {
      console.log(err)
      NotificationStore.addNotification('Группы', 'Произошла ошибка при удалении группы', 'error')
    }
  }

  async function handleAddGroup() {
    try {
      await baseApi.post('/group', {
        title: 'Название',
        items: [{ value: 'Значение', productId: productId }],
      })
      NotificationStore.addNotification('Группы', 'Группа удачно создана', 'success')

      const groupResponse: any = await fetchGroup()
      setProductGroups(groupResponse.data.records)
    } catch (err) {
      console.log(err)
      NotificationStore.addNotification('Группы', 'Произошла ошибка при создании группы', 'error')
    }
  }

  const handleItemChange = (index: number, key: 'value' | 'productId', value: string) => {
    const updatedItems = [...formData.items]
    updatedItems[index][key] = value
    setFormData({ ...formData, items: updatedItems })
  }

  const handleDeleteItem = (index: number) => {
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    setFormData({ ...formData, items: updatedItems })
  }

  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {productGroups.map(group => (
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', marginTop: '10px' }}
          key={group.id}
        >
          <div>{group.title}:</div>
          <div style={{ justifySelf: 'flex-end' }}>
            <DeleteIcon onClick={() => handleDeleteGroup(group.id)} />
            <EditIcon
              onClick={() => {
                setIsModalOpen(true)
                setGroup(group)
                setFormData({
                  title: group.title,
                  items: group.groupItems.map(item => ({
                    ...item,
                    productId: item.product?.id ?? '',
                  })),
                })
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {group.groupItems.map((subGroup: any) => (
              <button className={styles.group} key={subGroup.id} onClick={() => console.log(group)}>
                {subGroup.value}
              </button>
            ))}
          </div>
        </div>
      ))}
      <BaseButton onClick={handleAddGroup}>Add</BaseButton>

      {/* edit */}
      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TextInput
          title="Название"
          placeholder="Название"
          value={formData.title}
          style={{ marginBottom: '10px' }}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />

        {formData.items.map((item, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <TextInput
              value={item.value}
              onChange={e => handleItemChange(index, 'value', e.target.value)}
              placeholder="Значение"
            />
            <TextInput
              value={item.productId}
              onChange={e => handleItemChange(index, 'productId', e.target.value)}
              placeholder="ID продукта"
            />
            <DeleteIcon onClick={() => handleDeleteItem(index)} />
          </div>
        ))}
        <button
          style={{ color: 'gray', width: '100%' }}
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              items: [...prev.items, { value: '', productId: '' }],
            }))
          }
        >
          Добавить Группу
        </button>
        {errorText && <p style={{ color: 'red' }}>{errorText}</p>}
        <BaseButton style={{ width: '100%' }} variantColor="primary" onClick={handleEditGroup}>
          Сохранить
        </BaseButton>
      </Modal>
    </div>
  )
}

export default GroupTab
