const {faker} = require("@faker-js/faker");
const {getConnection} = require("../helpers/mysqlHelper");

const connection = getConnection();

async function getCustomers() {
    const result = await connection.promise().query('SELECT * FROM Customer');
    return result[0];
}

async function getCustomerById(id) {
    const result = await connection.promise().query('SELECT * FROM Customer WHERE id = ?', [id]);
    if (result[0].length === 0) {
        throw new Error('Customer not found');
    }
    return result[0][0];
}

async function getRandomCustomerId() {
    const result = await connection.promise().query('SELECT id FROM Customer ORDER BY RAND() LIMIT 1');
    return result[0][0].id;
}

async function createCustomer(name, age) {
    const result = await connection.promise().query('INSERT INTO Customer (name, age) VALUES (?, ?)', [name, age]);
    return getCustomerById(result[0].insertId);
}

async function generateFakeCustomers(amount) {
    const customers = generateFakeCustomer(amount);
    const result = await connection.promise().query('INSERT INTO Customer (name, age) VALUES ?', [customers.map(customer => [customer.name, customer.age])]);
    return result[0];
}

function mapResultToCustomer(result) {
    return {
        id: result.customer_id,
        name: result.customer_name,
        age: result.age,
    }
}

function generateFakeCustomer(amount) {
    let customers = []
    for (let i = 0; i < amount; i++) {
        customers.push({
            name: faker.person.firstName(),
            age: faker.number.int({min: 18, max: 100}),
        })
    }
    return customers;
}

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    mapResultToCustomer,
    generateFakeCustomers,
    getRandomCustomerId,
}