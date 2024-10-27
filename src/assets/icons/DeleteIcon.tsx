import { SVGProps } from 'react'

export const DeleteIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm3.46-6.12l1.42 1.42L12 12.42l1.12 1.12 1.42-1.42L13.42 11l1.12-1.12-1.42-1.42L12 9.58l-1.12-1.12-1.42 1.42L10.58 11l-1.12 1.12z'
				fill='#EF4444'
			/>
			<path d='M15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z' fill='#EF4444' />
		</svg>
	)
}
