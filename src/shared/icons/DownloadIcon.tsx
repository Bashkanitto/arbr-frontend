import { SVGProps } from 'react'

export const DownloadIcon = (props: SVGProps<SVGSVGElement>) => {
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
				d='M9 14V4M9 14L6 11M9 14L12 11M3 18H15'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
