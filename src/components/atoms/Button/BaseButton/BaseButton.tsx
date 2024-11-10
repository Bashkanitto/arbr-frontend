import { UnstyledButton } from '@mantine/core'
import { ComponentPropsWithRef, ComponentRef, forwardRef } from 'react'
import { cn } from '../../../../helpers'
import styles from './BaseButton.module.scss'

type BaseButtonVariantColor = 'primary' | 'secondary' | 'danger'
type BaseButtonProps = ComponentPropsWithRef<'button'> & {
	variantColor?: BaseButtonVariantColor
}

export const BaseButton = forwardRef<ComponentRef<'button'>, BaseButtonProps>(
	({ children, className, variantColor = 'primary', ...props }, ref) => {
		return (
			<UnstyledButton
				className={cn(styles['base-button'], className)}
				data-color={variantColor}
				ref={ref}
				{...props}
			>
				{children}
			</UnstyledButton>
		)
	}
)
