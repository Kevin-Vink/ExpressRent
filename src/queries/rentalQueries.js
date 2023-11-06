const {getConnection} = require("../helpers/mysqlHelper");
const {mapResultToCustomer, getRandomCustomerId} = require("./customerQueries");
const {mapResultToCar, getRandomCarId} = require("./carQueries");
const {faker, ne} = require("@faker-js/faker");

const connection = getConnection();

async function getRentals() {
    const results = await connection.promise().query('SELECT Rental.id, Rental.rental_date, Rental.return_date, Rental.car_id, Car.name as car_name, Car.year, Car.color, Car.type, Rental.daily_rate, Rental.customer_id, Customer.name as customer_name, Customer.age, Car.name as car_name, Company.name as company_name, Car.company_id FROM Rental LEFT JOIN Customer ON Rental.customer_id = Customer.id LEFT JOIN Car ON Rental.car_id = Car.id LEFT JOIN Company ON Car.company_id = Company.id');
    return mapResultToRental(results[0])
}

async function getRentalById(id) {
    const result = await connection.promise().query('SELECT * FROM Rental WHERE id = ?', [id]);
    if (result[0].length === 0) {
        throw new Error('Rental not found');
    }
    return result[0][0];
}

async function createRental(rental) {
    const result = await connection.promise().query('INSERT INTO Rental SET ?', [rental]);
    return result[0];
}

async function generateFakeRentals(amount) {
    const rentals = await generateFakeRental(amount)
    const result = await connection.promise().query('INSERT INTO Rental (rental_date, return_date, daily_rate, customer_id, car_id) VALUES ?', [rentals.map(rental => [rental.rental_date, rental.return_date, rental.daily_rate, rental.customer_id, rental.car_id])]);
    return result[0];
}

function mapResultToRental(results) {
    return results.map(result => {
        return {
            id: result.id,
            rental_date: result.rental_date,
            return_date: result.return_date,
            daily_rate: result.daily_rate,
            customer: mapResultToCustomer(result),
            car: mapResultToCar(result),
        }
    })
}

async function generateFakeRental(amount) {
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

module.exports = {
    getRentals,
    getRentalById,
    createRental,
    generateFakeRentals,
}