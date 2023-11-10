import { type Company } from './company'

export interface Car {
  id?: number
  company: Company
  dailyRate: number
  type: string
  year: number
  name: string
  color: string
}
