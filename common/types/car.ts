import { type Company } from './company'

export interface Car {
  id?: number
  company: Company
  type: string
  year: number
  name: string
  color: string
}
