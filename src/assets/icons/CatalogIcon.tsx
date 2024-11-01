import { SVGProps } from 'react'

export const CoinsIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg' {...props}>
			<rect
				x='20'
				y='20'
				width='160'
				height='160'
				rx='30'
				ry='30'
				fill='#c4c8de'
			/>

			<rect
				x='30'
				y='50'
				width='140'
				height='25'
				rx='15'
				ry='15'
				fill='#c4c8de'
			/>
			<rect
				x='30'
				y='90'
				width='140'
				height='25'
				rx='15'
				ry='15'
				fill='#c4c8de'
			/>
			<rect
				x='30'
				y='130'
				width='140'
				height='25'
				rx='15'
				ry='15'
				fill='#c4c8de'
			/>
			<rect
				x='30'
				y='170'
				width='140'
				height='25'
				rx='15'
				ry='15'
				fill='#c4c8de'
			/>
		</svg>
	)
}
