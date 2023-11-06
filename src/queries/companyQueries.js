const {faker} = require("@faker-js/faker");
const {getConnection} = require("../helpers/mysqlHelper");

const connection = getConnection();


async function getCompanies() {
    const result = await connection.promise().query('SELECT * FROM Company');
    return result[0];
}

async function getCompanyById(id) {
    const result = await connection.promise().query('SELECT * FROM Company WHERE id = ?', [id]);
    if (result[0].length === 0) {
        throw new Error('Company not found');
    }
    return result[0][0];
}

async function createCompany(name) {
    const result = await connection.promise().query('INSERT INTO Company(name) VALUES(?)', [name]);
    return result[0]
}

async function generateFakeCompanies(amount) {
    const companies = generateFakeCompany(amount)
    const result = await connection.promise().query('INSERT INTO Company (name) VALUES ?', [companies.map(company => [company.name])]);
    return result[0];
}

function mapResultToCompany(result) {
    return {
        id: result.company_id,
        name: result.company_name,
    }
}

async function getRandomCompanyId() {
    const result = await connection.promise().query('SELECT id FROM Company ORDER BY RAND() LIMIT 1');
    return result[0][0].id;
}

function generateFakeCompany(amount) {
    let companies = []
    for (let i = 0; i < amount; i++) {
        companies.push({
            name: faker.company.name(),
        })
    }
    return companies
}

module.exports = {
    getCompanies,
    getCompanyById,
    createCompany,
    generateFakeCompanies,
    mapResultToCompany,
    generateFakeCompany,
    getRandomCompanyId,
}