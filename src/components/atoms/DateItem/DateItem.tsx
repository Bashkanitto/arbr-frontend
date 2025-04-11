import { ComponentPropsWithoutRef } from 'react'
import styles from './DateItem.module.scss'

type DateItemVariantColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'gray'
  | 'secondary-text'
type DateItemProps = ComponentPropsWithoutRef<'div'> & {
  variantColor?: DateItemVariantColor
}

export const DateItem = ({
  children,
  className,
  variantColor = 'primary',
  ...props
}: DateItemProps) => {
  return (
    <div className={styles['date-item']} data-color={variantColor} {...props}>
      {children}
    </div>
  )
}
