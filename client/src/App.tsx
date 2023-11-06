import React, { type FunctionComponent, useEffect } from 'react'
import { fetchRentals, generateRentals } from './reducers/rentalsReducer'
import { useAppDispatch, useAppSelector } from './store/store'
import { type Rental } from './models/rental'
import { type Customer } from './models/customer'
import { fetchCustomers, generateCustomers } from './reducers/customerReducer'
import { type Car } from './models/car'
import { generateCars, fetchCars } from './reducers/carsReducer'
import { type Company } from './models/company'
import { fetchCompanies, generateCompanies } from './reducers/companyReducer'

const App: FunctionComponent = () => {
  const rentals = useAppSelector((state: any) => state.rentals.rentals)
  const customers = useAppSelector((state: any) => state.customers.customers)
  const cars = useAppSelector((state: any) => state.cars.cars)
  const companies = useAppSelector((state: any) => state.companies.companies)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchRentals())
    dispatch(fetchCustomers())
    dispatch(fetchCars())
    dispatch(fetchCompanies())
  }, [])

  const getRentals = (): void => {
    dispatch(fetchRentals())
  }

  const getCustomers = (): void => {
    dispatch(fetchCustomers())
  }

  const getCars = (): void => {
    dispatch(fetchCars())
  }

  const getCompanies = (): void => {
    dispatch(fetchCompanies())
  }

  const generateFakeRentals = (): void => {
    dispatch(generateRentals(5))
  }

  const generateFakeCustomers = (): void => {
    dispatch(generateCustomers(5))
  }

  const generateFakeCars = (): void => {
    dispatch(generateCars(5))
  }

  const generateFakeCompanies = (): void => {
    dispatch(generateCompanies(5))
  }

  function getRentalDuration (rental: Rental): number {
    const rentalStart = new Date(rental.rental_date)
    const rentalEnd = new Date(rental.return_date)
    const diff = Math.abs(rentalEnd.getTime() - rentalStart.getTime())
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  console.log(rentals)

  return (
        <div className="bg-stone-800 min-h-screen w-full text-white">
            <div className="px-12 flex flex-col gap-y-12 divide-y-2 divide-gray-300">
                <div>
                    <div className="flex w-full flex-row justify-between items-center">
                        <h1 className="text-3xl text-center">Rentals</h1>
                        <div className="flex gap-2 m-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={getRentals}>
                                Fetch Rentals
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={generateFakeRentals}>
                                Generate Rentals
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {rentals.length > 0 && rentals.map((rental: Rental) => (
                            <div key={rental.id}>
                                <p>Rented for {getRentalDuration(rental)} days</p>
                                <p>Daily rate ${rental.daily_rate}</p>
                                <p>Car: {rental.car.name}</p>
                                <p>Car type: {rental.car.type}</p>
                                <p>Rented by: {rental.customer.name}</p>
                                <p>Owned by: {rental.car.company.name}</p>
                                <p>Total ${(getRentalDuration(rental) * rental.daily_rate).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex w-full flex-row justify-between items-center">
                        <h1 className="text-3xl text-center">Customers</h1>
                        <div className="flex gap-2 m-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={getCustomers}>
                                Fetch Customers
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={generateFakeCustomers}>
                                Generate Customers
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {customers.length > 0 && customers.map((customer: Customer) => (
                            <div key={customer.id}>
                                <p>Name: {customer.name}</p>
                                <p>Age: {customer.age}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex w-full flex-row justify-between items-center">
                        <h1 className="text-3xl text-center">Cars</h1>
                        <div className="flex gap-2 m-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={getCars}>
                                Fetch Cars
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={generateFakeCars}>
                                Generate Cars
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {cars.length > 0 && cars.map((car: Car) => (
                            <div key={car.id}>
                                <p>Name: {car.name}</p>
                                <div className="w-6 h-6 rounded-full bg-white"
                                     style={{ backgroundColor: `#${car.color}` }}/>
                                <p>Type: {car.type}</p>
                                <p>Year: {car.year}</p>
                                <p>Owned by: {car.company.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex w-full flex-row justify-between items-center">
                        <h1 className="text-3xl text-center">Companies</h1>
                        <div className="flex gap-2 m-2">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={getCompanies}>
                                Fetch Companies
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={generateFakeCompanies}>
                                Generate Companies
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {companies.length > 0 && companies.map((company: Company) => (
                            <div key={company.id}>
                                <p>Name: {company.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
  )
}

export default App
