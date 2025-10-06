import { useState } from 'react'
import styles from '../ProductPage.module.scss'
import DescriptionTab from './DescriptionTab'
import DocumentTab from './DocumentTab'
import GroupTab from './GroupTab'

const ProductTabs = ({ product }: any) => {
  const [activeTab, setActiveTab] = useState('описание')

  return (
    <div className={styles.tabs}>
      <ul>
        {['описание', 'Документы', 'Группы'].map(tab => (
          <li
            key={tab}
            className={activeTab === tab ? styles.active : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>

      {activeTab === 'Описание' && <DescriptionTab description={product.description} />}
      {activeTab === 'Документы' && <DocumentTab product={product} />}
      {activeTab === 'Группы' && <GroupTab productId={product.id} />}
    </div>
  )
}

export default ProductTabs
