import { Outlet, useNavigate } from 'react-router-dom'
import React, { type FunctionComponent, useEffect, useState } from 'react'
import Sidebar from '../components/SideBar'

const DashboardLayout: FunctionComponent = () => {
  const [collapsed, setCollapsed] = useState(sessionStorage.getItem('collapsed') === String(true))
  const navigator = useNavigate()
  const handleCollapsed = (): void => {
    setCollapsed(!collapsed)
    sessionStorage.setItem('collapsed', String(!collapsed))
  }

  useEffect(() => {
    if (sessionStorage.getItem('collapsed') === null) {
      sessionStorage.setItem('collapsed', String(false))
    }

    if (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/') {
      navigator('/dashboard/cars')
    }
  }, [])

  return (
      <div className={`${collapsed ? 'grid-cols-sidebar-collapsed' : 'grid-cols-sidebar'} 
    grid min-h-screen transition-[grid-template-columns] duration-500 ease-in-out`}
      >
          <div></div>
          <Sidebar collapsed={collapsed} handleCollapse={handleCollapsed}/>
          <div className="text-white py-6 px-10">
              <Outlet/>
          </div>
      </div>
  )
}

export default DashboardLayout
