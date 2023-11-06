import {getConnection} from "../helpers/mysqlHelper";
import {getRandomCustomerId} from "./customerQueries";
import {getRandomCarId} from "./carQueries";
import {faker} from "@faker-js/faker";
import {Rental} from "../../common/types";
import {DBRental} from "../models";


const connection = getConnection();

export async function getRentals() : Promise<Rental[]> {
    return connection.promise().query<DBRental[]>('SELECT Rental.id, Rental.rental_date, Rental.return_date, Rental.car_id, Car.name as car_name, Car.year, Car.color, Car.type, Rental.daily_rate, Rental.customer_id, Customer.name as customer_name, Customer.age, Car.name as car_name, Company.name as company_name, Car.company_id FROM Rental LEFT JOIN Customer ON Rental.customer_id = Customer.id LEFT JOIN Car ON Rental.car_id = Car.id LEFT JOIN Company ON Car.company_id = Company.id').then(([results]) => mapResultToRentals(results));
}

export async function getRentalById(id: number) : Promise<Rental> {
    return connection.promise().query<DBRental[]>('SELECT Rental.id, Rental.rental_date, Rental.return_date, Rental.car_id, Car.name as car_name, Car.year, Car.color, Car.type, Rental.daily_rate, Rental.customer_id, Customer.name as customer_name, Customer.age, Car.name as car_name, Company.name as company_name, Car.company_id FROM Rental LEFT JOIN Customer ON Rental.customer_id = Customer.id LEFT JOIN Car ON Rental.car_id = Car.id LEFT JOIN Company ON Car.company_id = Company.id WHERE Rental.id = ?', [id]).then(([results]) => mapResultToRental(results[0]));
}

export async function createRental(rental: Rental) : Promise<void> {
    await connection.promise().query('INSERT INTO Rental (customer_id, car_id, daily_rate, rental_date, return_date) VALUES(?,?,?,?,?)', [rental.customer.id, rental.car.id, rental.daily_rate, rental.rental_date, rental.return_date]);
}

export async function generateFakeRentals(amount: number) : Promise<void> {
    const rentals = await generateFakeRental(amount)
    await connection.promise().query('INSERT INTO Rental (rental_date, return_date, daily_rate, customer_id, car_id) VALUES ?', [rentals.map(rental => [rental.rental_date, rental.return_date, rental.daily_rate, rental.customer_id, rental.car_id])]);
}

function mapResultToRentals(results: DBRental[]): Rental[] {
    return results.map(result => mapResultToRental(result))
}

function mapResultToRental(result: DBRental): Rental {
    return {
        id: result.id,
        rental_date: result.rental_date,
        return_date: result.return_date,
        daily_rate: result.daily_rate,
        customer: {
            id: result.customer_id,
            name: result.customer_name,
            age: result.age,
        },
        car: {
            id: result.car_id,
            name: result.car_name,
            year: result.year,
            color: result.color,
            type: result.type,
            company: {
                id: result.company_id,
                name: result.company_name,
            }

        },
    }
}

async function generateFakeRental(amount: number) {
    let rentals = []
    for (let i = 0; i < amount; i++) {
        const d = new Date();
        const pastDate = faker.date.between({from: d.setMonth(d.getMonth() - 3), to: new Date()});
        rentals.push({
            rental_date: pastDate,
            return_date: faker.date.between({from: pastDate, to: new Date()}),
            daily_rate: faker.number.float({min: 10, max: 100, precision: 0.01}),
            customer_id: await getRandomCustomerId(),
            car_id: await getRandomCarId(),
        })
    }
    return rentals
}