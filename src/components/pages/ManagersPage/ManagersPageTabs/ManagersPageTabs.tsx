import { BaseButton } from '../../../atoms/Button/BaseButton'
import { Select } from '../../../atoms/Select'
import { Tabs } from '../../../atoms/Tabs'
import styles from './ManagersPageTabs.module.scss'

export const ManagersPageTabs = () => {
	return (
		<div className={styles['managers-page-tabs']}>
			<Tabs className={styles['tab']} defaultValue='all'>
				<Tabs.List>
					<Tabs.Tab value='all'>Все карты</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel className={styles['panel']} value='all'>
					<Select
						placeholder='Типы менеджеров'
						data={[
							{ value: 'all', label: 'Все' },
							{ value: 'active', label: 'Активные' },
							{ value: 'inactive', label: 'Неактивные' },
						]}
					/>
					<Select
						placeholder='Статус'
						data={[
							{ value: 'all', label: 'Все' },
							{ value: 'active', label: 'Активные' },
							{ value: 'inactive', label: 'Неактивные' },
						]}
					/>
					<BaseButton>Экспорт</BaseButton>
				</Tabs.Panel>
				<Tabs.Panel value='groups'>
					<></>
				</Tabs.Panel>
			</Tabs>
		</div>
	)
}
