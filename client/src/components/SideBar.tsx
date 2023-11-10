import React, { type FunctionComponent, useEffect } from 'react'
import ListItem from './ListItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding } from '@fortawesome/free-regular-svg-icons'
import { faLeftRight, faCarSide, faUserGroup, faHome } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { fetchCars } from '../reducers/carsReducer'
import { toast } from 'react-toastify'
import { fetchCompanies } from '../reducers/companyReducer'
import { fetchCustomers } from '../reducers/customerReducer'

interface Props {
  collapsed: boolean
  handleCollapse: () => void
}

const SideBar: FunctionComponent<Props> = (props: Props) => {
  const {
    collapsed,
    handleCollapse
  } = props

  const dispatch = useAppDispatch()

  const { cars } = useAppSelector(state => state.cars)
  const { companies } = useAppSelector(state => state.companies)
  const { customers } = useAppSelector(state => state.customers)

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(fetchCars()).catch((err) => toast.error(err.message))
    } else if (companies.length === 0) {
      dispatch(fetchCompanies()).catch((err) => toast.error(err.message))
    } else if (customers.length === 0) {
      dispatch(fetchCustomers()).catch((err) => toast.error(err.message))
    }
  }, [cars, companies, customers])

  return (
        <div
            className={`fixed ${collapsed ? 'w-[72px] pl-2' : 'w-[250px]'} transition-[width] duration-500 ease-in-out z-30 h-full text-white border-r border-neutral-700 flex flex-col justify-between p-4`}>
            <div className="flex h-full flex-col gap-10">
                <div className="relative flex items-center">
                    <Link
                        to="/dashboard/cars"
                        className="flex z-30 w-full h-full flex-row justify-center items-center gap-x-2 group"
                    >
                        {collapsed
                          ? (
                                <div
                                    className="bg-blue-500 inline-flex justify-center items-center w-10 h-10 rounded-md">E</div>
                            )
                          : (
                                <h1 className="font-medium text-xl text-white">ExpressRent</h1>
                            )}
                    </Link>
                    <button
                        type="button"
                        onClick={handleCollapse}
                        className={`-right-8 rounded-md hover:bg-neutral-700/75
          transition-all duration-300 ease-in-out transform absolute bg-neutral-700 px-1.5 py-px`}
                    >
                        <FontAwesomeIcon size='sm' icon={faLeftRight}/>
                    </button>
                </div>
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex flex-col gap-4">
                        <ListItem title="Cars" to="/dashboard/cars" icon={<FontAwesomeIcon icon={faCarSide}/>}
                                  collapsed={collapsed}>
                            <p className="text-sm font-bold text-blue-500 bg-blue-300/25 rounded-md py-px px-2">{cars.length}</p>
                        </ListItem>
                        <ListItem title="Companies" to="/dashboard/companies"
                                  icon={<FontAwesomeIcon icon={faBuilding}/>}
                                  collapsed={collapsed}>
                            <p className="text-sm font-bold text-blue-500 bg-blue-300/25 rounded-md py-px px-2">{companies.length}</p>
                        </ListItem>
                        <ListItem title="Customers" to="/dashboard/customers"
                                  icon={<FontAwesomeIcon icon={faUserGroup}/>}
                                  collapsed={collapsed}>
                            <p className="text-sm font-bold text-blue-500 bg-blue-300/25 rounded-md py-px px-2">{customers.length}</p>
                        </ListItem>
                    </div>
                    <div>
                        <ListItem title="Go to website" to="/" icon={<FontAwesomeIcon icon={faHome}/>}
                                  collapsed={collapsed}/>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default SideBar
