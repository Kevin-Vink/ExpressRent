import {RowDataPacket} from "mysql2";

export interface DBCustomer extends RowDataPacket {
    id: number,
    name: string,
    dateBirth: Date,
    email: string,
}

export interface NewCustomer {
    name: string,
    dateBirth: Date,
    email: string,
}