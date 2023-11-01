let mysql = require('mysql2');

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

let makeConnection = () => {
    connection.connect();
    console.log("Connected to database");
}

let closeConnection = () => {
    connection.end();
    console.log("Closed connection to database");
}

let getConnection = () => {
    return connection;
}

module.exports = {
    makeConnection,
    closeConnection,
    getConnection
}