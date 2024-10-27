import { SVGProps } from 'react'

export const StatusIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width='22'
			height='18'
			viewBox='0 0 22 18'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<mask
				id='mask0_1120_280'
				// style='mask-type:luminance'
				maskUnits='userSpaceOnUse'
				x='0'
				y='0'
				width='22'
				height='18'
			>
				<path
					d='M20 1H2C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2V16C1 16.2652 1.10536 16.5196 1.29289 16.7071C1.48043 16.8946 1.73478 17 2 17H20C20.2652 17 20.5196 16.8946 20.7071 16.7071C20.8946 16.5196 21 16.2652 21 16V2C21 1.73478 20.8946 1.48043 20.7071 1.29289C20.5196 1.10536 20.2652 1 20 1Z'
					fill='white'
					stroke='white'
					stroke-width='2'
				/>
				<path
					d='M11 5.5V12.5M15 9V12.5M7 8V12.5'
					stroke='black'
					stroke-width='2'
					stroke-linecap='round'
				/>
			</mask>
			<g mask='url(#mask0_1120_280)'>
				<path d='M-1 -3H23V21H-1V-3Z' fill='currentColor' />
			</g>
		</svg>
	)
}
