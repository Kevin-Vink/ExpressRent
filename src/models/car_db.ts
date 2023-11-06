import {RowDataPacket} from "mysql2";

export interface DBCar extends RowDataPacket{
    id: number
    company_id: number
    company_name: string
    type: string
    year: number
    name: string
    color: string
}