import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rentalRouter, customerRouter, companyRouter, carRouter } from "./routes";
import {makeConnection} from "./helpers/mysqlHelper";

dotenv.config();

const app = express();
makeConnection();

app.use(bodyParser.json());

app.use(cors({origin: true, credentials: true}));
app.options("*", cors({origin: true, credentials: true}));

app.use('/api/rentals', rentalRouter);
app.use('/api/customers', customerRouter);
app.use('/api/companies', companyRouter);
app.use('/api/cars',carRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));