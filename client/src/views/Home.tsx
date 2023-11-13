import React, { type FunctionComponent, useEffect, useState } from 'react'
import {
  ArrowRightIcon, CalendarIcon,
  ChevronUpDownIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { DateRange } from 'react-date-range'
import type { Car } from '../../../common/types'

interface DateRangeType {
  startDate: Date
  endDate: Date
  key: string
}

const amountToShow = process.env.REACT_APP_RESULTS_AMOUNT ? parseInt(process.env.REACT_APP_RESULTS_AMOUNT) : 50

const startDate = new Date()
startDate.setDate(startDate.getDate() + 1)

const endDate = new Date()
endDate.setDate(endDate.getDate() + 7)
const initialSelectionRange: DateRangeType = {
  startDate,
  endDate,
  key: 'selection'
}

const Home: FunctionComponent = () => {
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const [types, setTypes] = useState<string[]>([])
  const [maxDailyPrice, setMaxDailyPrice] = React.useState<string>('')
  const [type, setType] = React.useState<string>('all')
  const [searchResults, setSearchResults] = React.useState<Car[]>([])
  const [loadMore, setLoadMore] = React.useState<number>(1)

  const [showDateRange, setShowDateRange] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isRenting, setIsRenting] = React.useState<boolean>(false)
  const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false)
  const [rentingId, setRentingId] = React.useState<number>(0)
  const [selectionRange, setSelectionRange] = React.useState<DateRangeType>(initialSelectionRange)

  const resultsRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTypes().then((res) => {
      setTypes(res)
    }).catch((err) => toast.error(err.message))
  }, [])

  const fetchTypes = async (): Promise<string[]> => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/cars/types`)
    return res.data
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (maxDailyPrice === '') return setMaxDailyPrice('')
      if (maxDailyPrice.split('.')[1]?.length === undefined) {
        return setMaxDailyPrice(maxDailyPrice + '.00')
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [maxDailyPrice])

  const handleChangePrice = (price: string): void => {
    // Negative number
    if (parseFloat(price) < 0) return
    // More than 2 decimal places
    if (price.split('.').length > 1 && price.split('.')[1].length > 2) return
    setMaxDailyPrice(price.toString())
  }

  const handleChangeSearch = (search: string): void => {
    setSearchTerm(search)
  }

  const handleDateRangeChange = (ranges: any): void => {
    const { selection } = ranges

    if (selection.startDate !== selectionRange.startDate) {
      setSelectionRange({
        ...selectionRange,
        startDate: selection.startDate
      })
    }

    if (selection.endDate !== selectionRange.endDate) {
      setSelectionRange({
        ...selectionRange,
        endDate: selection.endDate
      })
      if (selection.endDate > selection.startDate) {
        setShowDateRange(false)
      }
    }
  }

  const calculateTotalPrice = (dailyRate: number): string => {
    const days = (selectionRange.endDate.getTime() - selectionRange.startDate.getTime()) / (1000 * 3600 * 24)
    return `$${(dailyRate * days).toFixed(2)}`
  }

  const handleLoadMore = (): void => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    setLoadMore(loadMore + 1)
    setTimeout(() => {
      setIsLoadingMore(false)
    }, 1000)
  }

  const handleSearch = (): void => {
    if (isLoading) return
    if (showDateRange) setShowDateRange(false)
    setIsLoading(true)
    searchCars().then((res) => {
      setSearchResults(res)
      if (res.length === 0) {
        toast.error('No results found, please try different filters', { position: 'top-center' })
      }
    }).catch((err) => toast.error(err.message)).finally(() => {
      setTimeout(() => {
        setIsLoading(false)
        // Wait for the results to load
        setTimeout(() => {
          scrollToResults()
        }, 100)
      }, 1000)
    })
  }

  const scrollToResults = (): void => {
    window.scrollTo({
      top: resultsRef.current?.offsetTop,
      behavior: 'smooth'
    })
  }

  const searchCars = async (): Promise<Car[]> => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/cars/search?q=${searchTerm}&type=${type}&maxDailyPrice=${maxDailyPrice}`)
    return res.data
  }

  const rentCar = (car: Car): void => {
    setRentingId(car.id ?? 0)
    setIsRenting(true)
    axios.post(`${process.env.REACT_APP_SERVER_URL}/cars/${car.id}/rent`, {
      startDate: selectionRange.startDate,
      endDate: selectionRange.endDate
    }).then(() => {
      toast.success('Successfully rented car', { position: 'top-center' })
    }).catch((err) => toast.error(err.message))
      .finally(() => {
        setTimeout(() => {
          setIsRenting(false)
          setRentingId(0)
          setSearchResults(searchResults.filter((result) => result.id !== car.id))
        }, 1000)
      })
  }

  const formatDateString = (date: Date): string => {
    return date.toLocaleDateString('default', {
      month: 'short',
      day: '2-digit'
    })
  }

  return (
        <>
            <div className="w-full min-h-screen h-full grid lg:grid-cols-2 relative">
                <div
                    className="text-white bg-neutral-900 w-full h-full flex flex-col justify-between gap-4 min-h-screen px-10 py-5">
                    <div className='flex items-center gap-x-1'>
                        <div
                            className="bg-blue-500 inline-flex justify-center items-center w-8 h-8 rounded-md">E
                        </div>
                        <h1 className="font-medium text-xl text-white">xpressRent</h1>
                    </div>
                    <div className="flex flex-col gap-y-5">
                        <h2 className="text-8xl font-bold">Search.</h2>
                        <h2 className="text-8xl font-bold">Rent.</h2>
                        <h2 className="text-8xl font-bold">Drive.</h2>
                    </div>
                    <div className="text-neutral-300 pb-10">
                        <div className='flex flex-col gap-y-2'>
                            Rent a car from anywhere in the world. In 3 easy steps:
                            <ol className='pl-4 flex flex-col gap-y-2'>
                                <li className='flex gap-x-2'>
                                <span
                                    className='text-xs w-6 h-6 inline-flex items-center justify-center bg-neutral-600 rounded-full p-1'>1</span>
                                    Search for a car
                                </li>
                                <li className='flex gap-x-2'>
                            <span
                                className='text-xs w-6 h-6 inline-flex items-center justify-center bg-neutral-600 rounded-full p-1'>2</span>
                                    Rent it
                                </li>
                                <li className='flex gap-x-2'>
                            <span
                                className='text-xs w-6 h-6 inline-flex items-center justify-center bg-neutral-600 rounded-full p-1'>3</span>
                                    Drive it
                                </li>
                            </ol>
                            It&apos;s that simple.
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-400 flex flex-col px-6 py-2">
                    <div className="w-full text-white h-14 flex justify-end">
                        <Link to='/dashboard' className='h-full flex gap-x-1 items-center'>Go to
                            dashboard <ArrowRightIcon
                                className='w-auto h-5'/></Link>
                    </div>
                    <div className='flex-1 flex justify-center items-center w-full lg:min-h-fit min-h-[100vh]'>
                        <div
                            className={`relative lg:absolute border border-neutral-700 rounded-lg lg:right-[25%] xl:right-[30%] lg:translate-x-[35%] lg:-translate-y-[10%] transition-all shadow-lg ${showDateRange ? 'lg:top-[10%]' : 'lg:top-1/3'} bg-gradient-to-br from-neutral-800 to-neutral-900 w-fit h-fit`}>
                            <form onSubmit={handleSearch} className='flex flex-col gap-y-2 text-white'>
                                <div className='p-8 pb-4'>
                                    <h1 className='text-2xl font-bold'>Search for Cars</h1>
                                    <p className='text-neutral-400'>Search for cars by price, name, and type.</p>
                                </div>
                                <div className='border-t border-neutral-700 p-8 flex flex-col gap-y-2'>
                                    <div
                                        className='flex flex-col lg:flex-row justify-evenly items-center gap-5'>
                                        <div className='relative w-full'>
                                            <CalendarIcon
                                                className="absolute w-12 px-3.5 h-12 stroke-2 text-neutral-300 pointer-events-none"/>
                                            <button
                                                type='button'
                                                onClick={() => setShowDateRange(!showDateRange)}
                                                className="bg-transparent w-full text-left border border-neutral-600 placeholder:text-neutral-300 capitalize rounded-md pl-12 py-3 px-6">
                                                {formatDateString(selectionRange.startDate)} - {formatDateString(selectionRange.endDate)}
                                            </button>
                                            {showDateRange && (
                                                <DateRange ranges={[selectionRange]} months={2} direction='horizontal'
                                                           className='absolute top-14 left-0 z-10 bg-neutral-900 border border-neutral-600 rounded-md p-4'
                                                           minDate={startDate} onChange={handleDateRangeChange}/>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className='flex flex-col lg:flex-row lg:justify-evenly items-center gap-5'>
                                        <div className="relative w-full">
                                            <MagnifyingGlassIcon
                                                className="absolute w-12 px-3.5 h-12 stroke-2 text-neutral-300"/>
                                            <input
                                                className="bg-transparent w-full border border-neutral-600 placeholder:text-neutral-300 capitalize rounded-md pl-12 py-3 px-6"
                                                type="text" placeholder="Name"
                                                id="search"
                                                value={searchTerm}
                                                name="search" onChange={(e) => {
                                                  handleChangeSearch(e.target.value)
                                                }}/>
                                        </div>
                                        <div className="relative w-full">
                                            <ChevronUpDownIcon
                                                className="absolute w-12 px-3.5 h-12 stroke-2 text-neutral-300"/>
                                            <select
                                                className="bg-transparent w-full min-w-[14.5rem] border border-neutral-600 placeholder:text-neutral-300 capitalize rounded-md pl-12 py-3 px-6"
                                                name="type"
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
                                        <div className="relative w-full">
                                            <CurrencyDollarIcon
                                                className="absolute w-12 px-3.5 h-12 stroke-2 text-neutral-300"/>
                                            <input
                                                className="bg-transparent w-full min-w-[14.5rem] border border-neutral-600 placeholder:text-neutral-300 capitalize rounded-md pl-12 py-3 px-6"
                                                type="number" placeholder="Max Daily Price"
                                                id="maxDailyPrice"
                                                step="0.01"
                                                name="maxDailyPrice"
                                                value={maxDailyPrice}
                                                onChange={(e) => {
                                                  handleChangePrice(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='px-8 pb-4 flex justify-end'>
                                    <button
                                        type='submit'
                                        disabled={isLoading}
                                        className='rounded-full disabled:from-neutral-400 disabled:to-neutral-500 w-40 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-2'
                                        onClick={handleSearch}
                                    >
                                        {isLoading
                                          ? (
                                                <div
                                                    className="animate-spin z-10 rounded-full h-6 w-6 border-[2px] border-r-white border-neutral-400"/>
                                            )
                                          : (
                                              'Search!'
                                            )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div onClick={scrollToResults}
                     className={`${(!isLoading && searchResults.length > 0) && 'opacity-100 pointer-events-auto'} hidden lg:flex cursor-pointer opacity-0 pointer-events-none absolute bottom-6 rounded-full ring-2 ring-white z-30 left-1/2 -translate-x-1/2 h-14 justify-center w-8`}>
                    <span className='w-1.5 h-1.5 bg-white rounded-full absolute top-3 animate-scroll'/>
                </div>
            </div>
            {(!isLoading && searchResults.length > 0) && (
                <div ref={resultsRef} className="w-full min-h-screen h-full bg-neutral-900 relative">
                    <div
                        className="text-white bg-neutral-900 w-full h-full p-10">
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {searchResults.slice(0, (loadMore * amountToShow)).map((car) => (
                                <div key={car.id} className='rounded-md overflow-hidden bg-neutral-800'>
                                    <div className='flex flex-col gap-y-3 p-4'>
                                        <p className='overflow-ellipsis overflow-hidden whitespace-nowrap text-lg font-bold'>{car.name}</p>
                                        <div className='flex items-center gap-2'>
                                        <span className='w-5 h-5 rounded-full ring-1 ring-neutral-700'
                                              style={{ backgroundColor: `#${car.color}` }}/>
                                            <span className='w-1 h-1 bg-neutral-300 rounded-full'/>
                                            <p className='text-neutral-300 text-sm'>{car.type}</p>
                                            <span className='w-1 h-1 bg-neutral-300 rounded-full'/>
                                            <p className='text-neutral-300 text-sm'>{car.year}</p>
                                        </div>
                                        <span
                                            className='text-sm bg-green-400/25 text-green-400 rounded-full px-4 py-1 w-fit'>${car.dailyRate} per day</span>
                                        <div>
                                            <span className="text-sm text-neutral-400">Provided by</span>
                                            <p className='overflow-ellipsis overflow-hidden whitespace-nowrap'>{car.company.name}</p>
                                        </div>
                                    </div>
                                    <button
                                        className='w-full disabled:bg-neutral-400 hover:bg-blue-400 transition-all flex justify-center bg-blue-500 px-4 py-2 text-white text-sm'
                                        disabled={isRenting && rentingId === car.id}
                                        onClick={() => rentCar(car)}>
                                        {(isRenting && rentingId === car.id)
                                          ? (
                                                <div
                                                    className="animate-spin z-10 rounded-full h-5 w-5 border-[2px] border-r-white border-neutral-500"/>
                                            )
                                          : (
                                                `Rent for ${calculateTotalPrice(car.dailyRate)}`
                                            )}
                                    </button>
                                </div>
                            ))}
                        </div>
                        {Math.floor(searchResults.length / (loadMore * amountToShow)) > 0 && (
                            <div className='w-full flex items-center justify-center pt-12'>
                                <button
                                    type='submit'
                                    disabled={isLoadingMore}
                                    onClick={handleLoadMore}
                                    className='rounded-full disabled:bg-neutral-400 w-40 flex items-center justify-center transition-all bg-blue-500 hover:bg-blue-600 px-6 py-2'
                                >
                                    {(isLoadingMore)
                                      ? (
                                            <div
                                                className="animate-spin z-10 rounded-full h-6 w-6 border-[2px] border-r-white border-neutral-500"/>
                                        )
                                      : (
                                          'Load More'
                                        )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
  )
}

export default Home
