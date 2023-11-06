import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

export const makeConnection = () => {
    connection.connect();
    console.log("Connected to database");
}

export const closeConnection = () => {
    connection.end();
    console.log("Closed connection to database");
}

export const getConnection = () => {
    return connection;
}