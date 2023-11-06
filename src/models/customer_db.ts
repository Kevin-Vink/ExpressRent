import {RowDataPacket} from "mysql2";

export interface DBCustomer extends RowDataPacket {
    id: number,
    name: string,
    age: number
}