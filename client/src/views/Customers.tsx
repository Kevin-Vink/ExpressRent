import React, { type FunctionComponent, type ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { type Customer } from '../../../common/types'
import { toast } from 'react-toastify'
import { deleteCustomer, generateCustomers } from '../reducers/customerReducer'
import axios from 'axios'
import CreateCustomerModal from '../components/modals/customer/CreateCustomerModal'
import EditCustomerModal from '../components/modals/customer/EditCustomerModal'
import { fetchCars } from '../reducers/carsReducer'

const Customers: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const { customers } = useAppSelector((state) => state.customers)

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [customersToGenerate, setCustomersToGenerate] = useState<number>(5)
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (filteredCustomers.length > customers.length) {
      dispatch(fetchCars()).catch((err) => toast.error(err.message))
    }
  }, [customers, filteredCustomers])

  useEffect(() => {
    if (!isLoading) setIsLoading(true)
    const timeout = setTimeout(() => {
      handleFilter(searchTerm).catch((err) => toast.error(err.message))
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  const searchCustomers = async (searchTerm: string = ''): Promise<Customer[]> => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/customers/search?q=${searchTerm}`)
    return res.data
  }

  const deleteAction = (id: number | undefined, name: string): void => {
    if (id != null) {
      dispatch(deleteCustomer(id)).then(async () => {
        setIsLoading(true)
        await handleFilter(searchTerm)
        toast.success(`${name} deleted`)
      }).catch((err) => toast.error(err.message))
    }
  }

  const generateCustomersAction = (e: React.MouseEvent): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const target: any = e.target.tagName
    if (target.toLowerCase() === 'select') return
    dispatch(generateCustomers(customersToGenerate)).then(async () => {
      setIsLoading(true)
      await handleFilter(searchTerm)
      toast.success(`${customersToGenerate} New customers generated`)
    }).catch((err) => toast.error(err.message))
  }

  const handleFilter = async (keyword: string): Promise<void> => {
    setSearchTerm(keyword)

    searchCustomers(keyword).then((res) => {
      setFilteredCustomers(res)
    }).catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false))
  }

  const handleEditCustomer = (customer: Customer): void => {
    setSelectedCustomer(customer)
    setShowEditModal(true)
  }

  const handleCloseEditModal = (update: boolean = false): void => {
    setSelectedCustomer(undefined)
    setShowEditModal(false)
    if (update) handleFilter(searchTerm).catch((err) => toast.error(err.message))
  }

  const handleCloseCreateModal = (update: boolean = false): void => {
    setShowCreateModal(false)
    if (update) handleFilter(searchTerm).catch((err) => toast.error(err.message))
  }

  const selectComponent = (): ReactElement => {
    return (
            <select className="z-30 bg-transparent text-center" name="amount" id="amount"
                    onChange={(e) => setCustomersToGenerate(parseInt(e.target.value))}>
                {Array.from(Array(10).keys()).map((i) => (
                    <option key={(i + 1) * 5} value={(i + 1) * 5}>{(i + 1) * 5}</option>
                ))}
            </select>
    )
  }

  const birthDateToAge = (date: Date): number => {
    const today = new Date()
    const birthDate = new Date(date)
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }

  return (
        <>
            <div className="text-white bg-neutral-900 w-full h-full flex flex-col gap-4 min-h-screen px-10 py-5">
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-x-2">
                        <div className="relative flex">
                            <MagnifyingGlassIcon
                                className="w-8 px-2 h-8 stroke-2 rounded-l-md bg-stone-500 text-neutral-100"/>
                            <input
                                className="bg-stone-600 placeholder:text-neutral-300 capitalize rounded-r-md py-1 px-4"
                                type="text" placeholder="Search"
                                id="search"
                                value={searchTerm}
                                name="search" onChange={(e) => {
                                  setSearchTerm(e.target.value)
                                }}/>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-x-2">
                  <span
                      className="bg-stone-600 z-10 cursor-pointer hover:bg-green-500 transition-all rounded-md py-1 px-4"
                      onClick={(e) => generateCustomersAction(e)}>
                    Generate {selectComponent()} Customers
                    </span>
                        <button className="bg-stone-600 hover:bg-blue-500 transition-all rounded-md py-1 px-4"
                                onClick={() => setShowCreateModal(true)}>Create Customer
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    {searchTerm && (
                        <div className="flex w-fit py-px overflow-hidden cursor-pointer rounded-md group"
                             onClick={() => setSearchTerm('')}>
                        <span
                            className="bg-neutral-500/25 group-hover:bg-neutral-500/50 transition-all px-2 text-neutral-300 capitalize">
                            {searchTerm}
                        </span>
                            <XMarkIcon
                                className="w-6 h-full bg-red-500/25 text-red-500 group-hover:bg-red-500/30 transition-all"/>
                        </div>
                    )}
                    <p className="text-sm text-neutral-400 py-1">{filteredCustomers.length} {filteredCustomers.length === 1 ? 'match' : 'matches'} of {customers.length} total</p>
                </div>
                {isLoading
                  ? (
                        <div className="flex flex-col gap-4 flex-1 justify-center items-center h-full">
                            <div
                                className="animate-spin z-10 rounded-full h-12 w-12 border-[5px] border-r-blue-500 border-neutral-700"/>
                            <p className="text-sm text-neutral-300">Searching For Customers</p>
                        </div>
                    )
                  : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {(!isLoading && (filteredCustomers.length === 0 && searchTerm === '')) &&
                                <p>No customers in database</p>}
                            {filteredCustomers.map((customer) => (
                                <div key={customer.id}
                                     className='rounded-md h-full ring-1 ring-neutral-700 flex flex-col justify-between w-full overflow-hidden'>
                                    <div className="flex flex-col gap-y-2 p-4">
                                        <p className='overflow-ellipsis overflow-hidden whitespace-nowrap text-lg font-bold'>{customer.name}</p>
                                        <div className='flex gap-x-2'>
                                            <span className="text-sm text-neutral-400">Age</span>
                                            <p className="px-3 rounded-full text-sm bg-blue-400/25 text-blue-500 w-fit">{birthDateToAge(customer.dateBirth)}</p>
                                        </div>
                                        <p className='text-neutral-400'>{customer.email}</p>
                                    </div>
                                    <div className="grid grid-cols-2 bg-neutral-800">
                                        <button onClick={() => handleEditCustomer(customer)}
                                                className="hover:bg-stone-600 transition-all py-1 px-4">
                                            Edit
                                        </button>
                                        <button
                                            className="hover:bg-stone-600 transition-all py-1 px-4"
                                            type="button" onClick={() => {
                                              deleteAction(customer.id, customer.name)
                                            }}>Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            {showEditModal && <EditCustomerModal customer={selectedCustomer} handleClose={handleCloseEditModal}/>}
            {showCreateModal && <CreateCustomerModal handleClose={handleCloseCreateModal}/>}
        </>
  )
}

export default Customers
