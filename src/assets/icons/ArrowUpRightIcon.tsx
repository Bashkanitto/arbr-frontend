import { SVGProps } from 'react'

export const ArrowUpRightIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width='10'
			height='10'
			viewBox='0 0 10 10'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M1 9L9 1'
				stroke='white'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<path
				d='M1 1H9V9'
				stroke='white'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</svg>
	)
}
