import { SVGProps } from 'react'

export const CatalogIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
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
				d='M3 5h18c0.552 0 1-0.448 1-1s-0.448-1-1-1H3c-0.552 0-1 0.448-1 1s0.448 1 1 1z'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M3 10h18c0.552 0 1-0.448 1-1s-0.448-1-1-1H3c-0.552 0-1 0.448-1 1s0.448 1 1 1z'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M3 15h18c0.552 0 1-0.448 1-1s-0.448-1-1-1H3c-0.552 0-1 0.448-1 1s0.448 1 1 1z'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M3 20h18c0.552 0 1-0.448 1-1s-0.448-1-1-1H3c-0.552 0-1 0.448-1 1s0.448 1 1 1z'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
		</svg>
	)
}
