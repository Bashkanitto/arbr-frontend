import { ComponentPropsWithRef, forwardRef } from 'react'
import { cn } from '../../../../helpers'
import { BaseButton } from '../BaseButton'
import styles from './IconButton.module.scss'

type IconButtonProps = ComponentPropsWithRef<typeof BaseButton>

export const IconButton = forwardRef<
	ComponentPropsWithRef<typeof BaseButton>,
	IconButtonProps
>(({ children, className, ...props }) => {
	return (
		<BaseButton className={cn(styles['icon-button'], className)} {...props}>
			{children}
		</BaseButton>
	)
})
