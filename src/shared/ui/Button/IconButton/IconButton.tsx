import { ComponentPropsWithRef, forwardRef } from 'react'
import { BaseButton } from '../BaseButton'
import styles from './IconButton.module.scss'

type IconButtonProps = ComponentPropsWithRef<typeof BaseButton>

export const IconButton = forwardRef<ComponentPropsWithRef<typeof BaseButton>, IconButtonProps>(
  ({ children, className, ...props }) => {
    return (
      <BaseButton className={styles['icon-button']} {...props}>
        {children}
      </BaseButton>
    )
  }
)
