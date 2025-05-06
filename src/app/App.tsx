import '@mantine/charts/styles.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { themeConfig } from '@shared/utils/theme.config'
import { AppRouter } from '../router/AppRouter'

const App = () => {
  return (
    <MantineProvider theme={themeConfig}>
      <div className="app">
        <AppRouter />
      </div>
    </MantineProvider>
  )
}

export default App
