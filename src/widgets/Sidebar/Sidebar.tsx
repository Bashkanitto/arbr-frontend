import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { MainSidebarNav } from './SidebarNav'
import { SidebarManager } from './SidebarManagerInfo/SidebarManager'
import authStore from '@app/AuthStore'
import { Loader } from '@mantine/core'

export const Sidebar = observer(() => {
  const { initialized } = authStore

  return (
    <div className="flex flex-col justify-between fixed top-5 left-5 z-[100] w-[270px] h-[calc(100%-40px)] p-[30px_0_10px_0] rounded-[30px] bg-white shadow-lg">
      <div className="flex flex-col gap-[20px]">
        <img src="/images/fullLogo.svg" className="w-[100px] h-[40px] m-[0px_20px_0px]" alt="" />
        {!initialized ? (
          <div className="flex justify-center">
            <Loader size={40} />
          </div>
        ) : (
          <MainSidebarNav />
        )}
      </div>
      {initialized && (
        <div style={{ paddingInline: '10px' }}>
          <SidebarManager />
        </div>
      )}
    </div>
  )
})
