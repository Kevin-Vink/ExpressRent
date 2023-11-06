import { type Customer } from './customer'
import { type Car } from './car'

export interface Rental {
  id: number
  customer: Customer
  car: Car
  rental_date: Date
  return_date: Date
  daily_rate: number
}
