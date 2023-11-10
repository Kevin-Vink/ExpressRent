import React, { type FunctionComponent, type ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { deleteAllCars, deleteCar, generateCars } from '../reducers/carsReducer'
import { toast } from 'react-toastify'
import axios from 'axios'
import { type Car } from '../../../common/types'
import { XMarkIcon } from '@heroicons/react/24/outline'
import EditCarModal from '../components/EditCarModal'
import CreateCarModal from '../components/CreateCarModal'
import { fetchCompanies } from '../reducers/companyReducer'
import { Link } from 'react-router-dom'

const Cars: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)

  const [selectedCar, setSelectedCar] = useState<Car | undefined>(undefined)
  const { companies } = useAppSelector((state) => state.companies)

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

  return (
        <>
            <div className="text-white bg-neutral-900 p-4 w-full h-full flex flex-col gap-4 min-h-screen relative">
                {(!isLoading && companies.length === 0) && (
                    <div className="fixed top-0 left-0 flex items-center justify-center w-full z-20 transition-all hover:bg-blue-600 bg-blue-500">
                        <Link to={'/companies'} className="py-2">
                            No companies exist. Create a company now.
                        </Link>
                    </div>
                )}
              <div className='flex gap-x-2'>
                <input className="bg-stone-600 rounded-full px-4" type="text" placeholder="Search" id="search"
                       value={searchTerm}
                       name="search" onChange={(e) => {
                         setSearchTerm(e.target.value)
                       }}/>
                <select className="bg-stone-600 rounded-full px-4" name="type" id="type" value={type}
                        onChange={(e) => {
                          setType(e.target.value)
                        }}>
                  <option value="all">All</option>
                  {types.map((type) => (
                      <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p>{filteredCars.length} cars</p>
                <span
                    className="bg-stone-600 z-10 cursor-pointer hover:bg-green-500 transition-all rounded-full px-4"
                    onClick={(e) => generateCarsAction(e)}>
                    Generate {selectComponent()} Cars
                    </span>
                <button className="bg-stone-600 hover:bg-red-500 transition-all rounded-full px-4"
                        type="button" onClick={() => {
                          deleteAll()
                        }}>Delete All
                </button>
                <button className="bg-stone-600 hover:bg-blue-500 transition-all rounded-full px-4"
                        type="button" onClick={() => setShowCreateModal(true)}>
                  Create Car
                </button>
              </div>
              <div className="flex gap-x-2">
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
                        <div className="grid grid-cols-4 xl:grid-cols-6 gap-4">
                            {(!isLoading && (filteredCars.length === 0 && searchTerm === '' || filteredCars.length === 0 && type === 'all')) &&
                                <p>No cars in database</p>}
                            {filteredCars.map((car) => (
                                <div key={car.id}>
                                    <p>{car.name}</p>
                                    <div className="h-5 w-5 rounded-full" style={{ backgroundColor: `#${car.color}` }}/>
                                    <p>{car.type}</p>
                                    <p>{car.year}</p>
                                    <p>{car.dailyRate}</p>
                                    <p>{car.company.name}</p>
                                    <div className="flex gap-x-2">
                                        <button onClick={() => handleEditCar(car)}
                                                className="bg-stone-600 hover:bg-blue-500 transition-all rounded-full px-4 mb-4">
                                            Edit
                                        </button>
                                        <button
                                            className="bg-stone-600 hover:bg-red-500 transition-all rounded-full px-4 mb-4"
                                            type="button" onClick={() => {
                                              deleteAction(car.id, car.name)
                                            }}>Delete
                                        </button>
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
