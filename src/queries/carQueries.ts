import {faker} from "@faker-js/faker";
import {getConnection} from "../helpers/mysqlHelper";
import {getRandomCompanyId} from "./companyQueries";
import {Car} from "../../common/types";
import {CarType, DBCar, NewCar} from "../models";

const connection = getConnection();

export async function getCars() {
    return connection.promise().query<DBCar[]>('SELECT Car.id, Car.name, Car.year, Car.type, Car.color, Car.company_id, Car.daily_rate, Company.name as company_name FROM Car LEFT JOIN Company ON Car.company_id = Company.id ORDER BY id DESC').then(([results]) => mapResultToCars(results));
}

export async function searchCars(searchTerm: string, type: string) {
    return connection.promise().query<DBCar[]>(`SELECT Car.id, Car.name, Car.year, Car.type, Car.color, Car.company_id, Car.daily_rate, Company.name as company_name FROM Car LEFT JOIN Company ON Car.company_id = Company.id WHERE LOWER(Car.type) LIKE CONCAT('%', ?, '%') AND LOWER(Car.type) LIKE CONCAT('%', ?, '%') OR LOWER(Car.name) LIKE CONCAT('%', ?, '%') AND LOWER(Car.type) LIKE CONCAT('%', ?, '%') OR LOWER(Company.name) LIKE CONCAT('%', ?, '%') AND LOWER(Car.type) LIKE CONCAT('%', ?, '%') OR LOWER(Car.year) LIKE CONCAT('%', ?, '%') AND LOWER(Car.type) LIKE CONCAT('%', ?, '%') ORDER BY id DESC`, [searchTerm, type, searchTerm, type, searchTerm, type, searchTerm, type]).then(([results]) => mapResultToCars(results));
}

export async function getCarById(id: number) {
    return connection.promise().query<DBCar[]>('SELECT Car.id, Car.name, Car.year, Car.type, Car.color, Car.company_id, Car.daily_rate, Company.name as company_name FROM Car LEFT JOIN Company ON Car.company_id = Company.id WHERE Car.id = ?', [id]).then(([results]) => mapResultToCar(results[0]));
}

export async function getCarTypes() : Promise<CarType[]> {
    return connection.promise().query<CarType[]>('SELECT DISTINCT Car.type FROM Car').then(([results]) => results.map(result => result.type));
}

export async function createCar(car: Car) {
    const result = await connection.promise().query('INSERT INTO Car(type, year, company_id, color, name, daily_rate) VALUES(?,?,?,?,?,?)', [car.type, car.year, car.company.id, car.color, car.name, car.dailyRate]);
    return result[0]
}

export async function updateCar(id: number, car: Car) {
    await connection.promise().query('UPDATE Car SET name = ?, type = ?, year = ?, color = ?, company_id = ?, daily_rate = ? WHERE id = ?', [car.name, car.type, car.year, car.color, car.company.id, car.dailyRate, id]);
}

export async function deleteCar(id: number) {
    await connection.promise().query('DELETE FROM Car WHERE id = ?', [id]);
}

export async function deleteAllCars() {
    await connection.promise().query('DELETE FROM Car');
}

export async function generateFakeCars(amount: number) {
    const cars = await generateFakeCar(amount)
    const result = await connection.promise().query('INSERT INTO Car (type, year, company_id, color, name, daily_rate) VALUES ?', [cars.map(car => [car.type, car.year, car.company.id, car.color, car.name, car.dailyRate])]);
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
        dailyRate: result.daily_rate,
        type: result.type,
        company: {
            id: result.company_id,
            name: result.company_name
        }
    }
}

async function generateFakeCar(amount: number) {
    let cars : NewCar[] = [];
    // Generate unique cars
    while (cars.length < amount) {
        const car : NewCar = {
            name: faker.vehicle.manufacturer() + ' ' + faker.vehicle.model(),
            type: faker.vehicle.type(),
            dailyRate: faker.number.float({min: 10, max: 100, precision: 2}),
            company: {
                id: await getRandomCompanyId(),
            },
            color: faker.color.rgb({format: 'hex'}).slice(1),
            year: faker.number.int({min: 1990, max: new Date().getFullYear()}),
        }

        cars.push(car);
    }

    return cars;
}