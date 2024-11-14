import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import styles from './TopProductsChart.module.scss'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const TopProducts: React.FC = () => {
	const labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май']
	const data = [65, 59, 80, 81, 56]

	const chartData = {
		labels,
		datasets: [
			{
				label: '',
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
		},
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Самые продаваемы товары</h2>
			<Bar data={chartData} options={options} />
		</div>
	)
}

export default TopProducts
