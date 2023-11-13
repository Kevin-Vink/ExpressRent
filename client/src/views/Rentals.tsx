import React, { type FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { fetchRentals } from '../reducers/rentalsReducer'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const RentalStatus = {
  UPCOMING: 'Upcoming',
  ONGOING: 'Ongoing',
  RETURNED: 'Returned'
}
const Rentals: FunctionComponent = () => {
  const { rentals } = useAppSelector((state) => state.rentals)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!isLoading) setIsLoading(true)
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    dispatch(fetchRentals()).catch((err) => toast.error(err.message))
  }, [])

  const formatDateString = (date: Date): string => {
    return date.toLocaleDateString('default', {
      month: 'short',
      day: '2-digit'
    })
  }

  const calculateRentalDuration = (rentalDate: Date, returnDate: Date): string => {
    const diff = Math.abs(returnDate.getTime() - rentalDate.getTime())
    // Calculate days, weeks or months
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)

    if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'}`
    } else if (weeks < 4 && weeks % 7 !== 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
    } else {
      return `${months} ${months === 1 ? 'month' : 'months'}`
    }
  }

  const calculateTotalPrice = (startDate: Date, endDate: Date, dailyRate: number): string => {
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    return `$${(dailyRate * days).toFixed(2)}`
  }

  const calculateRentalStatus = (rentalDate: Date, returnDate: Date): string => {
    const currentDate = new Date()
    if (currentDate < rentalDate) {
      return RentalStatus.UPCOMING
    } else if (currentDate > returnDate) {
      return RentalStatus.RETURNED
    } else {
      return RentalStatus.ONGOING
    }
  }

  return (
        <div className="text-white bg-neutral-900 w-full h-full flex flex-col gap-4 min-h-screen px-10 py-5">
            {isLoading
              ? (
                    <div className="flex flex-col gap-4 flex-1 justify-center items-center h-full">
                        <div
                            className="animate-spin z-10 rounded-full h-12 w-12 border-[5px] border-r-blue-500 border-neutral-700"/>
                        <p className="text-sm text-neutral-300">Searching For Rentals</p>
                    </div>
                )
              : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {(!isLoading && rentals.length === 0) &&
                            <p>No rentals in database</p>}
                        {rentals.map((rental) => (
                                <div key={rental.id}
                                     className='rounded-xl bg-neutral-800'>
                                  <div className='px-6 py-4 flex flex-col gap-y-4'>
                                    <p className={`text-sm w-fit px-2 py-1 rounded-full ${calculateRentalStatus(new Date(rental.rental_date), new Date(rental.return_date)) === RentalStatus.UPCOMING ? 'text-orange-400 bg-orange-400/25' : calculateRentalStatus(new Date(rental.rental_date), new Date(rental.return_date)) === RentalStatus.ONGOING ? 'text-green-400 bg-green-400/25' : 'text-red-500 bg-red-400/25'}`}>{calculateRentalStatus(new Date(rental.rental_date), new Date(rental.return_date))}</p>
                                    <div className='flex justify-between items-center gap-x-2'>
                                      <p>{formatDateString(new Date(rental.rental_date))}</p>
                                      <FontAwesomeIcon className='text-blue-500' size='lg' icon={faArrowRight} />
                                      <p>{formatDateString(new Date(rental.return_date))}</p>
                                    </div>
                                    <div className='grid grid-cols-3 gap-x-4 gap-y-2'>
                                      <div className='col-span-2'>
                                        <span className='text-neutral-300 text-xs'>Rental Duration</span>
                                        <p className='font-bold'>{calculateRentalDuration(new Date(rental.rental_date), new Date(rental.return_date))}</p>
                                      </div>
                                      <div>
                                        <span className='text-neutral-300 text-xs'>Price paid</span>
                                        <p className='font-bold'>{calculateTotalPrice(new Date(rental.rental_date), new Date(rental.return_date), rental.car.dailyRate)}</p>
                                      </div>
                                      <div className='col-span-3'>
                                        <span className='text-neutral-300 text-xs'>Customer</span>
                                        <p className='font-bold'>{rental.customer.name}</p>
                                      </div>
                                      <div className='col-span-2 h-20'>
                                        <span className='text-neutral-300 text-xs'>Vehicle</span>
                                        <p className='font-bold'>{rental.car.name}</p>
                                      </div>
                                      <div className='col-span-1 flex flex-col gap-y-2'>
                                        <span className='text-neutral-300 text-xs'>Color</span>
                                        <span className='w-5 h-5 rounded-full ring-1 ring-neutral-700' style={{ backgroundColor: `#${rental.car.color}` }} />
                                      </div>
                                      <div className='col-span-3'>
                                        <span className='text-neutral-300 text-xs'>Owned by</span>
                                        <p className='font-bold'>{rental.car.company.name}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                        ))}
                    </div>
                )}
        </div>
  )
}

export default Rentals
