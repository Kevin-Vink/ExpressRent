require('dotenv').config({
    path: '.env'
});

const express = require('express');
const {makeConnection} = require("./helpers/mysqlHelper");
const bodyParser = require('body-parser');

const app = express();
makeConnection();

app.use(bodyParser.json({extended: true}));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));