require('dotenv').config({
    path: '.env'
});

const express = require('express');
const cors = require('cors');
const {makeConnection} = require("./helpers/mysqlHelper");
const bodyParser = require('body-parser');

const app = express();
makeConnection();

app.use(bodyParser.json({extended: true}));

app.use(cors({origin: true, credentials: true}));
app.options("*", cors({origin: true, credentials: true}));

app.use('/api/rentals', require('./routes/rentalsRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));