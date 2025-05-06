import { SVGProps } from 'react'

export const HistoryIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
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
				d='M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10h-2c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8c2.778 0 5.252 1.4 6.72 3.526L15 10h7V3l-2.88 2.88C17.036 3.055 14.634 2 12 2z'
				fill='currentColor'
			/>
			<path
				d='M12 7c-0.552 0-1 0.448-1 1v5.586l3.293 3.293a1 1 0 001.414-1.414L13 12.586V8c0-0.552-0.448-1-1-1z'
				fill='currentColor'
			/>
		</svg>
	)
}
