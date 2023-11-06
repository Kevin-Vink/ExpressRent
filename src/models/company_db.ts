import {RowDataPacket} from "mysql2";

export interface DBCompany extends RowDataPacket {
    id: number
    name: string
}