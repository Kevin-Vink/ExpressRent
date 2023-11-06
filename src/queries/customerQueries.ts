import {Customer} from "../../common/types";
import {DBCustomer} from "../models";
import {faker} from "@faker-js/faker";
import {getConnection} from "../helpers/mysqlHelper";

const connection = getConnection();

export async function getCustomers() : Promise<Customer[]> {
    return connection.promise().query<DBCustomer[]>('SELECT * FROM Customer').then(([results]) => mapResultToCustomers(results));
}

export async function getCustomerById(id: number) : Promise<Customer> {
    return connection.promise().query<DBCustomer[]>('SELECT * FROM Customer WHERE id = ?', [id]).then(([results]) => mapResultToCustomer(results[0]));
}

export async function getRandomCustomerId() : Promise<void> {
    await connection.promise().query('SELECT id FROM Customer ORDER BY RAND() LIMIT 1');
}

export async function createCustomer(customer: Customer) {
    await connection.promise().query('INSERT INTO Customer (name, age) VALUES (?, ?)', [customer.name, customer.age]);
}

export async function generateFakeCustomers(amount: number) : Promise<void> {
    const customers = generateFakeCustomer(amount);
    await connection.promise().query('INSERT INTO Customer (name, age) VALUES ?', [customers.map(customer => [customer.name, customer.age])]);
}

function mapResultToCustomers(results: DBCustomer[]) : Customer[] {
    return results.map(result => mapResultToCustomer(result));
}

function mapResultToCustomer(result: DBCustomer) : Customer {
    return {
        id: result.customer_id,
        name: result.customer_name,
        age: result.age,
    }
}

function generateFakeCustomer(amount: number) : Customer[] {
    let customers = []
    for (let i = 0; i < amount; i++) {
        customers.push({
            name: faker.person.firstName(),
            age: faker.number.int({min: 18, max: 100}),
        })
    }
    return customers;
}