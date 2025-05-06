import { Select } from '@mantine/core'
import { ArrowDownIcon } from '@shared/icons'
import styles from './Select.module.scss'

export const SelectExtend = Select.extend({
  defaultProps: {
    rightSection: <ArrowDownIcon />,
  },
  classNames: {
    root: styles['select'],
    input: styles['select-input'],
    dropdown: styles['select-dropdown'],
    option: styles['select-option'],
  },
})

export { Select }
