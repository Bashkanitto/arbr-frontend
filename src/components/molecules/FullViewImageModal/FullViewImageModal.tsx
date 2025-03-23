import React from 'react'
import styles from './FullViewImageModal.module.scss' // Assuming you have a CSS file for styles

interface FullImageModalProps {
  imageUrl: string
  isOpen: boolean
  onClose: () => void
}

const FullViewImageModal: React.FC<FullImageModalProps> = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div onClick={onClose} className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <img
          src={imageUrl.replace('http://3.76.32.115:3000', 'https://api.arbr.kz')}
          alt="Full View"
          className={styles.fullImage}
        />
      </div>
    </div>
  )
}

export default FullViewImageModal
