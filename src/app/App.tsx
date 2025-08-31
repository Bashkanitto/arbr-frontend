import '@mantine/charts/styles.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { themeConfig } from '@shared/utils/theme.config'
import { AppRouter } from '../router/AppRouter'
import { domAnimation, LazyMotion } from 'framer-motion'

const App = () => {
  return (
    <MantineProvider theme={themeConfig}>
      <LazyMotion features={domAnimation}>
        <div className="app">
          <AppRouter />
        </div>
      </LazyMotion>
    </MantineProvider>
  )
}

export default App
