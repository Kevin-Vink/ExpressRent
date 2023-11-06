import {RowDataPacket} from "mysql2";

export interface DBRental extends RowDataPacket{
    id: number
    rental_date: Date
    return_date: Date
    daily_rate: number
    customer_id: number
    customer_name: string
    company_id: number
    company_name: string
    age: number
    car_id: number
    car_name: string
    year: number
    color: string
    type: string
}