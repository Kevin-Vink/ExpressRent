import {Company} from "../../common/types";
import {faker} from "@faker-js/faker";
import {getConnection} from "../helpers/mysqlHelper";
import {DBCompany, NewCompany} from "../models";

const connection = getConnection();

export async function getCompanies() : Promise<Company[]> {
    return connection.promise().query<DBCompany[]>('SELECT * FROM Company ORDER BY id DESC').then(([results]) => mapResultsToCompanies(results));
}

export async function searchCompanies(name: string) : Promise<Company[]> {
    return connection.promise().query<DBCompany[]>('SELECT * FROM Company WHERE LOWER(name) LIKE ? ORDER BY id DESC', [`%${name}%`]).then(([results]) => mapResultsToCompanies(results));
}

export async function getCompanyById(id: number) : Promise<Company> {
    return connection.promise().query<DBCompany[]>('SELECT * FROM Company WHERE id = ?', [id]).then(([results]) => mapResultToCompany(results[0]));
}

export async function createCompany(company: Company) : Promise<void> {
     await connection.promise().query('INSERT INTO Company(name) VALUES(?)', [company.name]);
}

export async function updateCompany(id: number, company: Company) : Promise<void> {
    await connection.promise().query('UPDATE Company SET name = ? WHERE id = ?', [company.name, id]);
}

export async function deleteCompany(id: number) : Promise<void> {
    await connection.promise().query('DELETE FROM Company WHERE id = ?', [id]);
}

export async function generateFakeCompanies(amount: number) {
    const existingCompanies = await getCompanies();
    const companies = generateFakeCompany(amount, existingCompanies)
    const result = await connection.promise().query('INSERT INTO Company (name) VALUES ?', [companies.map(company => [company.name])]);
    return result[0];
}

function mapResultsToCompanies(results: DBCompany[]) : Company[] {
    return results.map(result => mapResultToCompany(result));
}

function mapResultToCompany(result: DBCompany) : Company {
    return {
        id: result.id,
        name: result.name,
    }
}

export async function getRandomCompanyId() {
    return connection.promise().query<DBCompany[]>('SELECT id FROM Company ORDER BY RAND() LIMIT 1').then(([results]) => results[0].id);
}

function generateFakeCompany(amount: number, existingCompanies: Company[]) {
    let companies: NewCompany[] = []

    while (companies.length < amount) {
        const company = {
            name: faker.company.name(),
        }
        if (!existingCompanies.find(existingCompany => existingCompany.name === company.name)
        && !companies.find(newCompany => newCompany.name === company.name)) {
            companies.push(company)
        }
    }
    return companies
}