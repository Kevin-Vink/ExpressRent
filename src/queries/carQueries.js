const {faker} = require("@faker-js/faker");
const {getConnection} = require("../helpers/mysqlHelper");
const {getRandomCompanyId, mapResultToCompany} = require("./companyQueries");

const connection = getConnection();

async function getCars() {
    const result = await connection.promise().query('SELECT Car.id as car_id, Car.name as car_name, Car.year, Car.type, Car.color, Car.company_id, Company.name as company_name FROM Car LEFT JOIN Company ON Car.company_id = Company.id');
    result[0] = result[0].map(mapResultToCar)
    console.log(result[0])
    return result[0];
}

async function getCarById(id) {
    const result = await connection.promise().query('SELECT * FROM Car WHERE id = ?', [id]);
    if (result[0].length === 0) {
        throw new Error('Car not found');
    }
    return result[0][0];
}

async function createCar(type, year, company_id, color, name) {
    const result = await connection.promise().query('INSERT INTO Car(type, year, company_id, color, name) VALUES(?,?,?,?,?)', [type, year, company_id, color, name]);
    return result[0]
}

async function generateFakeCars(amount) {
    const cars = await generateFakeCar(amount)
    const result = await connection.promise().query('INSERT INTO Car (type, year, company_id, color, name) VALUES ?', [cars.map(car => [car.type, car.year, car.company_id, car.color, car.name])]);
    return result[0];
}

async function getRandomCarId() {
    const result = await connection.promise().query('SELECT id FROM Car ORDER BY RAND() LIMIT 1');
    return result[0][0].id;
}

function mapResultToCar(result) {
    return {
        id: result.car_id,
        name: result.car_name,
        year: result.year,
        color: result.color,
        type: result.type,
        company: mapResultToCompany(result)
    }
}

async function generateFakeCar(amount) {
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

module.exports = {
    getCars,
    getCarById,
    createCar,
    generateFakeCars,
    mapResultToCar,
    getRandomCarId,
}