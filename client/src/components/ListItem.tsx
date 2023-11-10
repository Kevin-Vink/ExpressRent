import React, { type FunctionComponent, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Props {
  to?: string
  icon: React.JSX.Element
  title: string
  showOnCollapsed?: boolean
  collapsed?: boolean
  children?: React.JSX.Element
}

const listItemProps: Props = {
  icon: <></>,
  title: 'Null',
  to: '',
  collapsed: Boolean(sessionStorage.getItem('collapsed')),
  children: <></>
}

const ListItem: FunctionComponent<Props> = (props: Props) => {
  const {
    to,
    collapsed,
    icon,
    children,
    title
  } = props

  const location = useLocation()

  const [pathname, setPathname] = useState(window.location.pathname.split('/dashboard')[1])

  useEffect(() => {
    setPathname(window.location.pathname)
  }, [location])

  return (
        <Link
            to={to ?? ''}
            className={`flex items-center ${!collapsed ? 'justify-between focus:before:-left-[1.125rem] hover:before:-left-[1.125rem]' : 'justify-center focus:before:-left-[.5rem] hover:before:-left-[.5rem]'} 
            transition-all relative py-1 duration-300 ease-in-out group before:absolute before:-left-5 before:w-1 
            before:h-full before:bg-blue-500 before:transition-all before:duration-300 before:rounded-r-md 
            before:ease-in-out hover:before:bg-blue-500 focus:before:bg-blue-500 !outline-none
      ${pathname.includes(to !== '/' ? to ?? '/dashboard' : '/unknown') && `${!collapsed ? 'before:-left-[1.125rem] hover:before-left-[1.125rem]' : 'before:-left-[.5rem] hover:before-left-[.5rem]'} hover:before:bg-blue-500`}`}
        >
            <div className="flex gap-x-3">
                {React.cloneElement(icon, {
                  size: 'lg',
                  className: `${pathname.includes(to !== '/' ? to ?? '/dashboard' : '/unknown') ? 'text-blue-500' : 'text-gray-500'} duration-300 delay-100 ease-in-out
          transition-transform group-hover:-rotate-6 group-hover:text-blue-500 group-focus:text-blue-500`
                })}
                <h1 className={`${collapsed && 'absolute w-max bg-neutral-900 left-0 shadow-md rounded-md px-5 py-2 opacity-0 ' +
                'pointer-events-none group-hover:opacity-100 border border-neutral-700 group-hover:left-20 duration-500 ease-in-out -top-1 '} font-medium text-white`}
                >
                    {title}
                </h1>
            </div>
            {(!collapsed) && children}
        </Link>
  )
}

ListItem.defaultProps = listItemProps

export default ListItem
