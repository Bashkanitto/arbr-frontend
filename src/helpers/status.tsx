/* eslint-disable @typescript-eslint/no-explicit-any */
type StatusProps = {
	children: 'active' | 'pending' | 'inactive' // restrict values to specific strings
}

const Status: React.FC<StatusProps> = ({ children }) => {
	switch (children) {
		case 'active':
			return (
				<p
					style={{
						textAlign: 'center',
						padding: '5px 10px',
						borderRadius: '10px',
					}}
					className='active activebg'
				>
					Разрешено
				</p>
			)
		case 'pending':
			return (
				<p
					style={{
						textAlign: 'center',
						padding: '5px 10px',
						borderRadius: '10px',
					}}
					className='warning warningbg'
				>
					В ожидании
				</p>
			)
		case 'inactive':
			return (
				<p
					style={{
						textAlign: 'center',
						padding: '5px 10px',
						borderRadius: '10px',
					}}
					className='danger dangerbg'
				>
					Отклонено
				</p>
			)
		default:
			return <p>Неизвестный статус</p>
	}
}

export default Status
