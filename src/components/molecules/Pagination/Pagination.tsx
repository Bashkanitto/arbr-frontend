// src/components/Pagination.tsx
import React from 'react'
import { BaseButton } from '../../atoms/Button/BaseButton'
import styles from './Pagination.module.scss'

interface PaginationProps {
	page: number
	totalPages: number
	onPageChange: (newPage: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
	page,
	totalPages,
	onPageChange,
}) => {
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			onPageChange(newPage)
		}
	}

	return (
		<div className={styles.pagination}>
			<BaseButton
				onClick={() => handlePageChange(page - 1)}
				disabled={page === 1}
			>
				←
			</BaseButton>
			<div className={styles.paginationPage}>{`${page} / ${totalPages}`}</div>
			<BaseButton
				onClick={() => handlePageChange(page + 1)}
				disabled={page === totalPages}
			>
				→
			</BaseButton>
		</div>
	)
}
