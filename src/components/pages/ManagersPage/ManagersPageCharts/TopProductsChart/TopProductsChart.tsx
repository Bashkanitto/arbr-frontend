import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
	TooltipItem,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import styles from './TopProductsChart.module.scss'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const TopProducts: React.FC = () => {
	const labels = [
		'МРТ аппараты',
		'ЭКГ аппараты',
		'УЗИ аппараты',
		'Эндоскопы',
		'Медицинские маски',
		'Перчатки медицинские',
	]

	const data = [120000, 95000, 150000, 85000, 20000, 175000]

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Количество закупок (тг)',
				data,
				backgroundColor: '#AFB1F8',
			},
		],
	}

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem: TooltipItem<'bar'>) {
						const value = Number(tooltipItem.raw) // Преобразуем к числу
						return `${value} тг`
					},
				},
			},
		},
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Самые закупаемые товары</h2>
			<Bar data={chartData} options={options} />
		</div>
	)
}

export default TopProducts
