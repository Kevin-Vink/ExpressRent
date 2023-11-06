import {faker} from "@faker-js/faker";
import {getConnection} from "../helpers/mysqlHelper";
import {getRandomCompanyId} from "./companyQueries";
import {Car} from "../../common/types";
import {DBCar} from "../models";


const connection = getConnection();

export async function getCars() : Promise<Car[]> {
    return connection.promise().query<DBCar[]>('SELECT Car.id as car_id, Car.name as car_name, Car.year, Car.type, Car.color, Car.company_id, Company.name as company_name FROM Car LEFT JOIN Company ON Car.company_id = Company.id').then(([results]) => mapResultToCars(results));
}

export async function getCarById(id: number) {
    return connection.promise().query<DBCar[]>('SELECT Car.id as car_id, Car.name as car_name, Car.year, Car.type, Car.color, Car.company_id, Company.name as company_name FROM Car LEFT JOIN Company ON Car.company_id = Company.id WHERE Car.id = ?', [id]).then(([results]) => mapResultToCar(results[0]));
}

export async function createCar(car: Car) {
    const result = await connection.promise().query('INSERT INTO Car(type, year, company_id, color, name) VALUES(?,?,?,?,?)', [car.type, car.year, car.company.id, car.color, car.name]);
    return result[0]
}

export async function generateFakeCars(amount: number) {
    const cars = await generateFakeCar(amount)
    const result = await connection.promise().query('INSERT INTO Car (type, year, company_id, color, name) VALUES ?', [cars.map(car => [car.type, car.year, car.company_id, car.color, car.name])]);
    return result[0];
}

export async function getRandomCarId() : Promise<number> {
    return connection.promise().query<DBCar[]>('SELECT id FROM Car ORDER BY RAND() LIMIT 1').then(([results]) => results[0].id);
}

export function mapResultToCars(results: DBCar[]) : Car[] {
    return results.map(result => mapResultToCar(result));
}

function mapResultToCar(result: DBCar) : Car {
    return {
        id: result.id,
        name: result.name,
        year: result.year,
        color: result.color,
        type: result.type,
        company: {
            id: result.company_id,
            name: result.company_name
        }
    }
}

async function generateFakeCar(amount: number) {
    let cars = []
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < amount; i++) {
        cars.push({
            name: faker.vehicle.manufacturer() + ' ' + faker.vehicle.model(),
            type: faker.vehicle.type(),
            company_id: await getRandomCompanyId(),
            color: faker.color.rgb({format: 'hex'}).slice(1),
            year: faker.number.int({min: 1990, max: currentYear}),
        })
    }
    return cars
}