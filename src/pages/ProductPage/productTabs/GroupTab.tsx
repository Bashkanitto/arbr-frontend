import { deleteGroup, editGroup, fetchGroup } from '@services/api/productService'
import { useEffect, useState } from 'react'
import styles from '../ProductPage.module.scss'
import { DeleteIcon, EditIcon } from '@assets/icons'
import NotificationStore from '@store/NotificationStore'
import { Modal, TextInput } from '@mantine/core'
import { BaseButton } from '@components/atoms/Button/BaseButton'
import { wait } from '../../../helpers'
import baseApi from '@services/api/base'

interface GroupItem {
  id?: number
  value: string
  productId: string | number
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
  const [items, setItems] = useState<GroupItem[]>([])
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
    if (!formData.title.trim() || items.some(item => !item.value.trim() || !item.productId)) {
      setErrorText('Заполните все поля')
      return
    }

    try {
      const response = await editGroup(String(group?.id), {
        title: formData.title,
        items: items,
      })

      NotificationStore.addNotification('Группа', 'Группа успешно обновлена:', 'success')
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      setErrorText('Ошибка при сохранении')
      NotificationStore.addNotification('Группа', 'Произошла ошибка:', 'error')
    } finally {
      setItems([{ value: '', productId: '' }])
      setErrorText('')
    }
  }
  const handleItemChange = (index: number, key: 'value' | 'productId', value: string) => {
    const updatedItems: any = [...items]
    updatedItems[index][key] = value
    console.log(updatedItems[index][key])
    setItems(updatedItems)
  }

  const handleDeleteGroup = async groupId => {
    try {
      await deleteGroup(groupId)
      NotificationStore.addNotification('Группы', 'Группа удачно удалена', 'success')
      wait(1000).then(() => window.location.reload())
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
      // wait(1000).then(() => window.location.reload())
    } catch (err) {
      console.log(err)
      NotificationStore.addNotification('Группы', 'Произошла ошибка при создании группы', 'error')
    }
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
                setItems(group.groupItems)
                setFormData({
                  title: group.title,
                  items: { value: group.groupItems.values, productId: productId },
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
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />

        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <TextInput
              value={item.value}
              onChange={e => handleItemChange(index, 'value', e.target.value)}
              placeholder="Значение"
            />
            <TextInput
              value={item.productId}
              onChange={e => handleItemChange(index, 'productId', e.target.value)}
              placeholder="Product ID"
            />
          </div>
        ))}
        <button
          style={{ color: 'gray', width: '100%' }}
          onClick={() => setItems([...items, { value: '', productId: '' }])}
        >
          Добавить
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
