import { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../../helpers'
import styles from './DateItem.module.scss'

type DateItemVariantColor = 'primary' | 'secondary' | 'gray'
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
		<div
			className={cn(styles['date-item'], className)}
			data-color={variantColor}
			{...props}
		>
			{children}
		</div>
	)
}
