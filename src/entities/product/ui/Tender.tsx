/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRightIcon } from '../../../shared/icons/ArrowUpRightIcon'
import { DiscountIcon } from '../../../shared/icons/DiscountIcon'
import authStore from '@app/AuthStore'
import { Avatar } from '../../../shared/ui/Avatar'
import DiscountModal from '@pages/CatalogPage/DiscountModal/DiscountModal'
import EditBonusModal from '@pages/CatalogPage/EditBonusModal/EditBonusModal'
import styles from './Tender.module.scss'

const Tender = ({ user }: { user: any }) => {
  const navigate = useNavigate()
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false)
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false)
  const { isAdmin } = authStore

  // Filter unique brands
  const uniqueBrands: string[] = useMemo(() => {
    return Array.from(
      new Set(
        user.vendorGroups
          .map((item: any) => item.product?.brand?.name)
          .filter((brandName: string | undefined) => brandName)
      )
    )
  }, [user.vendorGroups])

  return (
    <div className={styles['tender']}>
      {/* Поставщик */}
      <div className={styles['tender-user']}>
        <div className={styles['tender-user-info']}>
          <a href={`vendor/${user.id}`}>
            <Avatar w={60} h={60} className="rounded-full" />
            <div className="flex flex-col justify-center">
              <p className={styles['tender-user-name']}>{user.firstName}</p>
              <p className={styles['tender-user-role']}>
                {user.role == 'admin' ? 'Админ' : 'Поставщик'}
              </p>
            </div>
          </a>

          {/* Только админ может давать скидки и бонусы модалкой всем продуктам */}
          {isAdmin && (
            <>
              <button onClick={() => setIsBonusModalOpen(true)} className={styles['link']}>
                <ArrowUpRightIcon />
              </button>
              <button
                onClick={() => setIsDiscountModalOpen(true)}
                className={styles['link']}
                style={{ background: 'black' }}
              >
                <DiscountIcon />
              </button>
            </>
          )}
        </div>

        {/* бренды */}
        <div className={styles['tender-user-statistics']}>
          <div className={styles.brandWrapper}>
            {uniqueBrands.map((brandName, index) => (
              <div key={index} className={styles.brand}>
                {brandName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Товары */}
      <div className={styles['tender-items']}>
        {user.vendorGroups
          .filter((item: any) => item.product?.status === 'active')
          .map((item: any) => (
            <button
              onClick={() => navigate(`/product/${item.product.id}`)}
              key={item.id}
              className={`${styles['tender-item']} border border-gray-200`}
            >
              <img
                src={item.product?.images[0]?.url.replace(
                  'http://3.76.32.115:3000',
                  'https://api.arbr.kz'
                )}
                className={styles['tender-image']}
              />
              <p className={styles['tender-title']}>{item.product?.name}</p>
            </button>
          ))}
      </div>

      {/* Модалка бонусов */}
      {isBonusModalOpen && (
        <EditBonusModal
          user={user}
          isOpen={isBonusModalOpen}
          onClose={() => setIsBonusModalOpen(false)}
        />
      )}

      {/* Модалка скидки */}
      {isDiscountModalOpen && (
        <DiscountModal
          user={user}
          isOpen={isDiscountModalOpen}
          onClose={() => setIsDiscountModalOpen(false)}
        />
      )}
    </div>
  )
}

export default Tender
