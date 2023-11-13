import React, { type FunctionComponent, type ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { deleteAllCars, deleteCar, fetchCars, generateCars } from '../reducers/carsReducer'
import { toast } from 'react-toastify'
import axios from 'axios'
import { type Car } from '../../../common/types'
import { XMarkIcon, MagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/outline'
import EditCarModal from '../components/modals/car/EditCarModal'
import CreateCarModal from '../components/modals/car/CreateCarModal'
import { fetchCompanies } from '../reducers/companyReducer'
import { Link } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/20/solid'

const Cars: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

  const [selectedCar, setSelectedCar] = useState<Car | undefined>(undefined)
  const { companies } = useAppSelector((state) => state.companies)
  const { cars } = useAppSelector((state) => state.cars)

  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [type, setType] = useState<string>('all')
  const [carsToGenerate, setCarsToGenerate] = useState<number>(5)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (companies.length === 0) {
      setIsLoading(true)
      dispatch(fetchCompanies()).catch((err) => toast.error(err.message))
    }
  }, [])

  useEffect(() => {
    if (filteredCars.length > cars.length) {
      dispatch(fetchCars()).catch((err) => toast.error(err.message))
    }
  }, [cars, filteredCars])

  useEffect(() => {
    fetchTypes().catch((err) => toast.error(err.message))
  }, [])

  useEffect(() => {
    if (!isLoading) setIsLoading(true)
    const timeout = setTimeout(() => {
      handleFilter(searchTerm, type).catch((err) => toast.error(err.message))
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchTerm, type])

  const handleFilter = async (keyword: string, type: string): Promise<void> => {
    const fetchedTypes: string[] = await fetchTypes()

    setSearchTerm(keyword)
    setTypes(fetchedTypes)

    if (fetchedTypes.find((t) => t === type) === undefined) {
      setType('all')
      searchCars(keyword, 'all').then((res) => {
        setFilteredCars(res)
      }).catch((err) => toast.error(err.message))
        .finally(() => setIsLoading(false))
      return
    }

    if (type === 'all') {
      setType('all')
      searchCars(keyword, 'all').then((res) => {
        setFilteredCars(res)
      }).catch((err) => toast.error(err.message))
        .finally(() => setIsLoading(false))
    } else {
      setType(type)
      searchCars(keyword, type).then((res) => {
        setFilteredCars(res)
      }).catch((err) => toast.error(err.message))
        .finally(() => setIsLoading(false))
    }
  }

  const fetchTypes = async (): Promise<string[]> => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/cars/types`)
    return res.data
  }

  const searchCars = async (searchTerm: string = '', type: string = ''): Promise<Car[]> => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/cars/search?q=${searchTerm}&type=${type}`)
    return res.data
  }

  const deleteAction = (id: number | undefined, name: string): void => {
    if (id != null) {
      dispatch(deleteCar(id)).then(async () => {
        setIsLoading(true)
        await handleFilter(searchTerm, type)
        toast.success(`${name} deleted`)
      }).catch((err) => toast.error(err.message))
    }
  }

  const generateCarsAction = (e: React.MouseEvent): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const target: any = e.target.tagName
    if (target.toLowerCase() === 'select') return
    dispatch(generateCars(carsToGenerate)).then(async () => {
      setIsLoading(true)
      await handleFilter(searchTerm, type)
      toast.success(`${carsToGenerate} New cars generated`)
    }).catch((err) => toast.error(err.message))
  }

  const deleteAll = (): void => {
    dispatch(deleteAllCars()).then(async () => {
      setIsLoading(true)
      await handleFilter(searchTerm, type)
      toast.success('All cars deleted')
    }).catch((err) => toast.error(err.message))
  }

  const handleEditCar = (car: Car): void => {
    setSelectedCar(car)
    setShowEditModal(true)
  }

  const handleCloseEditModal = (update: boolean = false): void => {
    setSelectedCar(undefined)
    setShowEditModal(false)
    if (update) handleFilter(searchTerm, type).catch((err) => toast.error(err.message))
  }

  const handleCloseCreateModal = (update: boolean = false): void => {
    setShowCreateModal(false)
    if (update) handleFilter(searchTerm, type).catch((err) => toast.error(err.message))
  }

  const selectComponent = (): ReactElement => {
    return (
            <select className="z-30 bg-transparent text-center" name="amount" id="amount"
                    onChange={(e) => setCarsToGenerate(parseInt(e.target.value))}>
                {Array.from(Array(10).keys()).map((i) => (
                    <option key={(i + 1) * 5} value={(i + 1) * 5}>{(i + 1) * 5}</option>
                ))}
            </select>
    )
  }

  const shadeColor = (color: string): string => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + 60)).toString(16)).slice(-2))
  }

  const nFormatter = (num: number): string => {
    const lookup = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = lookup.slice().reverse().find(function (item) {
      return num >= item.value
    })
    return item ? (num / item.value).toFixed(1).replace(rx, '$1') + item.symbol : '0'
  }

  return (
        <>
            <div
                className="text-white bg-neutral-900 z-30 w-full h-full flex flex-col gap-4 min-h-screen relative px-10 py-5">
                {(!isLoading && companies.length === 0) && (
                    <div
                        className="fixed top-0 left-0 flex items-center justify-center w-full z-10 transition-all hover:bg-blue-600 bg-blue-500">
                        <Link to={'/dashboard/companies'} className="py-2">
                            No companies exist. Create a company now.
                        </Link>
                    </div>
                )}
                <div className='flex justify-between items-center'>
                  <div className="flex items-center gap-x-2">
                    <div className="relative flex">
                        <MagnifyingGlassIcon className="w-8 px-2 h-8 stroke-2 rounded-l-md bg-stone-500 text-neutral-100"/>
                        <input className="bg-stone-600 placeholder:text-neutral-300 capitalize rounded-r-md py-1 px-4" type="text" placeholder="Search"
                               id="search"
                               value={searchTerm}
                               name="search" onChange={(e) => {
                                 setSearchTerm(e.target.value)
                               }}/>
                    </div>
                    <select className="bg-stone-600 text-center min-w-[15rem] rounded-md py-1 px-4" name="type"
                            id="type" value={type}
                            onChange={(e) => {
                              setType(e.target.value)
                            }}>
                        <option value="all">All</option>
                        {types.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                  </div>
                  <div className="hidden gap-x-2 items-center lg:flex">
                    <span
                        className="bg-stone-600 cursor-pointer hover:bg-green-500 transition-all rounded-md py-1 px-4"
                        onClick={(e) => generateCarsAction(e)}>
                    Generate {selectComponent()} Cars
                    </span>
                    <button className="bg-stone-600 hover:bg-red-500 transition-all rounded-md py-1 px-4"
                            type="button" onClick={() => {
                              deleteAll()
                            }}>Delete All
                    </button>
                    <button className="bg-stone-600 hover:bg-blue-500 transition-all rounded-md py-1 px-4"
                            type="button" onClick={() => setShowCreateModal(true)}>
                        Create Car
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

                    {(type && type !== 'all') && (
                        <div className="flex w-fit py-px overflow-hidden cursor-pointer rounded-md group"
                             onClick={() => setType('')}>
                        <span
                            className="bg-neutral-500/25 group-hover:bg-neutral-500/50 transition-all px-2 text-neutral-300 capitalize">
                            {type}
                        </span>
                            <XMarkIcon
                                className="w-6 h-full bg-red-500/25 text-red-500 group-hover:bg-red-500/30 transition-all"/>
                        </div>
                    )}
                    <p className="text-sm text-neutral-400 py-1">{filteredCars.length} {filteredCars.length === 1 ? 'match' : 'matches'} of {cars.length} total</p>
                </div>
                {isLoading
                  ? (
                        <div className="flex flex-col gap-4 flex-1 justify-center items-center h-full">
                            <div
                                className="animate-spin z-10 rounded-full h-12 w-12 border-[5px] border-r-blue-500 border-neutral-700"/>
                            <p className="text-sm text-neutral-300">Searching For Cars</p>
                        </div>
                    )
                  : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {(!isLoading && (filteredCars.length === 0 && searchTerm === '' || filteredCars.length === 0 && type === 'all')) &&
                                <p>No cars in database</p>}
                            {filteredCars.map((car) => (
                                <div key={car.id} className='rounded-md ring-1 ring-neutral-700 flex flex-col h-full w-full overflow-hidden'>
                                  <div
                                      className="w-full h-14 border-b border-neutral-700 flex items-center justify-between px-4"
                                      style={{ backgroundImage: `linear-gradient(to bottom right,#${car.color}, ${shadeColor(car.color)})` }}>
                                    <p className="text-sm font-black" style={{
                                      color: shadeColor(car.color),
                                      textShadow: '#111 .75px .75px'
                                    }}>{car.year}</p>
                                    <div className='w-fit h-full flex gap-x-2'>
                                      <PencilIcon className="h-full py-4 transition-all hover:text-black text-black/25"
                                          onClick={() => handleEditCar(car)}/>
                                    <TrashIcon className="h-full py-4 transition-all hover:text-red-400 text-black/25"
                                               onClick={() => {
                                                 deleteAction(car.id, car.name)
                                               }}/>
                                    </div>
                                  </div>
                                  <div className="bg-neutral-800/25 flex flex-col gap-y-2 p-4">
                                    <p className='overflow-ellipsis overflow-hidden whitespace-nowrap text-lg font-bold'>{car.name}</p>
                                    <p className='overflow-ellipsis overflow-hidden whitespace-nowrap text-neutral-400'>{car.type}</p>
                                    <span className='rounded-full w-fit px-2 text-sm py-1 bg-green-400/25 text-green-500'>$ {nFormatter(car.dailyRate)} Daily</span>
                                    <div>
                                      <span className="text-sm text-neutral-400">Owned by</span>
                                      <p className='overflow-ellipsis overflow-hidden whitespace-nowrap'>{car.company.name}</p>
                                    </div>
                                  </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            {showEditModal && <EditCarModal car={selectedCar} handleClose={handleCloseEditModal}/>}
            {showCreateModal && <CreateCarModal handleClose={handleCloseCreateModal}/>}
        </>
  )
}

export default Cars
