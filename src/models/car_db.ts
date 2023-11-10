import {RowDataPacket} from "mysql2";

export interface DBCar extends RowDataPacket{
    id: number
    company_id: number
    company_name: string
    type: string
    daily_rate: number
    year: number
    name: string
    color: string
}

export interface NewCar {
    name: string
    year: number
    color: string
    type: string
    dailyRate: number,
    company: {
        id: number
    }
}

export interface CarType extends RowDataPacket{
    types: string[]
}