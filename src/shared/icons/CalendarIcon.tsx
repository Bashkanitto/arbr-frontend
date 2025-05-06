import { SVGProps } from 'react'

export const CalendarIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width='18'
			height='19'
			viewBox='0 0 18 19'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M5 2V1M13 2V1M3 7H15M4 3H14C14.5523 3 15 3.44772 15 4V15C15 15.5523 14.5523 16 14 16H4C3.44772 16 3 15.5523 3 15V4C3 3.44772 3.44772 3 4 3Z'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
