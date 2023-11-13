import {Customer} from "../../common/types";
import {DBCustomer} from "../models";
import {faker} from "@faker-js/faker";
import {getConnection} from "../helpers/mysqlHelper";

const connection = getConnection();

export async function getCustomers() : Promise<Customer[]> {
    return connection.promise().query<DBCustomer[]>('SELECT * FROM Customer ORDER BY id DESC').then(([results]) => mapResultToCustomers(results));
}

export async function searchCustomers(query: string) : Promise<Customer[]> {
    return connection.promise().query<DBCustomer[]>('SELECT * FROM Customer WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? ORDER BY id DESC', [`%${query}%`, `%${query}%`]).then(([results]) => mapResultToCustomers(results));
}

export async function getCustomerById(id: number) : Promise<Customer> {
    return connection.promise().query<DBCustomer[]>('SELECT * FROM Customer WHERE id = ?', [id]).then(([results]) => mapResultToCustomer(results[0]));
}

export async function getRandomCustomerId() : Promise<number> {
    return await connection.promise().query<DBCustomer[]>('SELECT id FROM Customer ORDER BY RAND() LIMIT 1').then(([results]) => results[0].id);
}

export async function createCustomer(customer: Customer) {
    await connection.promise().query('INSERT INTO Customer (name, dateBirth, email) VALUES (?, ?, ?)', [customer.name, formatDateString(customer.dateBirth), customer.email]);
}

export async function updateCustomer(id: number, customer: Customer) {
    await connection.promise().query('UPDATE Customer SET name = ?, dateBirth = ?, email = ? WHERE id = ?', [customer.name, formatDateString(customer.dateBirth), customer.email, id]);
}

export async function deleteCustomer(id: number) {
    await connection.promise().query('DELETE FROM Customer WHERE id = ?', [id]);
}

export async function generateFakeCustomers(amount: number) : Promise<void> {
    const existingCustomers = await getCustomers();
    const customers = generateFakeCustomer(amount, existingCustomers);
    await connection.promise().query('INSERT INTO Customer (name, dateBirth, email) VALUES ?', [customers.map(customer => [customer.name, formatDateString(customer.dateBirth), customer.email])]);
}

function mapResultToCustomers(results: DBCustomer[]) : Customer[] {
    return results.map(result => mapResultToCustomer(result));
}

function mapResultToCustomer(result: DBCustomer) : Customer {
    return {
        id: result.id,
        name: result.name,
        dateBirth: result.dateBirth,
        email: result.email,
    }
}

function formatDateString(date: Date) : string {
    return new Date(date).toISOString().split('T')[0]
}

function generateFakeCustomer(amount: number, existingCustomers: Customer[]) : Customer[] {
    let customers : Customer[] = []

    while (customers.length < amount) {

        const firstName = faker.person.firstName();
        const customer : Customer = {
            name: firstName,
            dateBirth: faker.date.birthdate(),
            email: faker.internet.email({ firstName }).toLowerCase(),
        }

        if (!existingCustomers.find(existingCustomer => existingCustomer.email === customer.email) &&
            !customers.find(existingCustomer => existingCustomer.email === customer.email)) {
            customers.push(customer);
        }
    }
    return customers;
}