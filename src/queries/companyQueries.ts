import {Company} from "../../common/types";
import {faker} from "@faker-js/faker";
import {getConnection} from "../helpers/mysqlHelper";
import {DBCompany} from "../models";

const connection = getConnection();

export async function getCompanies() : Promise<Company[]> {
    return connection.promise().query<DBCompany[]>('SELECT * FROM Company').then(([results]) => mapResultsToCompanies(results));
}

export async function getCompanyById(id: number) : Promise<Company> {
    return connection.promise().query<DBCompany[]>('SELECT * FROM Company WHERE id = ?', [id]).then(([results]) => mapResultToCompany(results[0]));
}

export async function createCompany(company: Company) : Promise<void> {
     await connection.promise().query('INSERT INTO Company(name) VALUES(?)', [company.name]);
}

export async function generateFakeCompanies(amount: number) {
    const companies = generateFakeCompany(amount)
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

function generateFakeCompany(amount: number) {
    let companies = []
    for (let i = 0; i < amount; i++) {
        companies.push({
            name: faker.company.name(),
        })
    }
    return companies
}