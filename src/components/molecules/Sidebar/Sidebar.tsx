import { observer } from 'mobx-react-lite'
import { MainSidebarNav } from './SidebarNav'
import { SidebarManager } from './SidebarManagerInfo/SidebarManager'
import authStore from '@app/AuthStore'
import { Loader } from '@mantine/core'

export const Sidebar = observer(() => {
  const { initialized } = authStore

  return (
    <div className="flex flex-col justify-between fixed top-3 left-3 z-[100] w-[270px] h-[calc(100%-20px)] p-[30px_0_10px_0] rounded-[20px] bg-white border-gray-200 border ">
      <div className="flex flex-col gap-[20px] overflow-y-scroll">
        <img src="/images/logo.svg" className="w-[100px] h-[25px] m-[0px_12px_0px]" alt="" />
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
