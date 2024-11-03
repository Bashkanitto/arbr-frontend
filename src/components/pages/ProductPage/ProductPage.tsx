import styles from './ProductPage.module.scss'

const ProductPage = () => {
	const product = {
		id: 0,
		title: 'Беговая дорожка NordicTrack C300',
		count: 'Мало',
		price: '75 000',
		order: '120 дней',
		description: '',
		details: '',
	}

	return (
		<div className={styles['product-page']}>
			<div className={styles['product-image']}>
				<img src='/images/product_photo.png' alt='' />
				<img src='/images/product_photo.png' alt='' />
				<img src='/images/product_photo.png' alt='' />
			</div>
			<div className={styles['product-info']}>
				<div className={styles['container']}>
					<p className={styles['product-breadcrumbs']}>
						Товар <span>Беговые дорожки</span>
					</p>
					<h4>{product.title}</h4>
					<p className={styles['product-count']}>
						<span>{product.count} </span>в наличии
					</p>
					<div className={styles['product-price']}>
						<span>Цена за товар</span>
						<p>{product.price}₸ </p>
					</div>
					<button>% ИЗМЕНИТЬ ПРОЦЕНТ</button>
					<div className={styles['product-details']}>
						<p>
							Доставка <span>{product.order}</span>
						</p>
						<p>
							Описание <span>K</span>
						</p>
						<p>
							Характеристики <span>{product.details}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductPage
