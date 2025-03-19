import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { editProduct } from '@services/api/productService'

interface MarkdownEditorProps {
  productId: number
  value: string | null
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ productId, value }) => {
  const [markdown, setMarkdown] = useState<string | undefined>(value || '')

  useEffect(() => {
    setMarkdown(value || '')
  }, [value]) // Обновляет стейт, если приходит новое value

  const handleSave = async () => {
    try {
      if (markdown === undefined) return
      await editProduct(productId, { description: markdown })
      alert('Описание сохранено!')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  return (
    <div>
      <h3>Редактировать описание</h3>
      <MDEditor value={markdown} onChange={setMarkdown} height={300} /> {/* Увеличил высоту */}
      <button onClick={handleSave} style={{ marginTop: '10px' }}>
        Сохранить
      </button>
    </div>
  )
}

export default MarkdownEditor
