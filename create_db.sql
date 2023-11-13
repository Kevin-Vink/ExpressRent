DROP DATABASE IF EXISTS Rentals;
CREATE DATABASE Rentals;

use Rentals;

CREATE TABLE Company(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Customer(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    dateBirth DATE NOT NULL
);

CREATE TABLE Car(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL REFERENCES Company(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL DEFAULT 'Sedan',
    year YEAR NOT NULL,
    daily_rate DECIMAL(8,2) NOT NULL DEFAULT 25.00,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(6) NOT NULL DEFAULT '000000'
);

CREATE TABLE Rental(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES Customer(id) ON DELETE CASCADE,
    car_id INT NOT NULL REFERENCES Car(id) ON DELETE CASCADE,
    rental_date DATE NOT NULL,
    return_date DATE NOT NULL
);

# Companies
INSERT INTO Company(name) VALUES('Hertz');
INSERT INTO Company(name) VALUES('Avis');
INSERT INTO Company(name) VALUES('Alamo');
INSERT INTO Company(name) VALUES('Kayak');
INSERT INTO Company(name) VALUES('Expedia');
INSERT INTO Company(name) VALUES('Enterprise');
INSERT INTO Company(name) VALUES('Hotwire');
INSERT INTO Company(name) VALUES('Priceline');

# Customers
INSERT INTO Customer(name, dateBirth, email) VALUES('Roxanne Castaneda', '1990-01-01', 'roxanne23@hotmail.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Chaim Mcclain', '1991-02-02', 'chaim_mcclain55@gmail.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Bessie Boyle', '1992-03-03', 'bessie1992@outlook.mail.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Nicola Roach', '1993-04-04', 'nicola@hertz.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Rehan Delgado', '1994-05-05', 'rehan_delgado@gmail.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Lillian Freeman', '1995-06-06', 'lillian_06@outlook.mail.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Emelia Mitchell', '1996-07-07', 'emilia89@avisrentals.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Zara Montgomery', '1997-08-08', 'zaramontgomery@gmail.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Rafe Baird', '1998-09-09', 'rafe@expedia.com');
INSERT INTO Customer(name, dateBirth, email) VALUES('Teddy Lucas', '1999-10-10', 'teddy_lucas99@hotmail.com');

# Cars
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (1, 'SUV', 2016, 82.99, 'Nissan Rogue', 'ffffff');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (2, 'Sedan', 2017, 68.99, 'Toyota Corolla', 'a7a1a1');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (3, 'Sedan', 2018, 72.99, 'Honda Civic', '999c99');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (4, 'Extended Pick-up', 2019, 99.99, 'Ford F-150', 'ff000c');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (5, 'Sedan', 2020, 79.99, 'Toyota Camry', 'b2b27b');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (6, 'Pick-up', 2021, 89.99, 'Chevrolet Silverado', '92b0b0');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (7, 'Sedan', 2023, 74.99, 'Honda Accord', 'FFA500');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (8, 'SUV', 2019, 84.99, 'Toyota RAV4', 'A52A2A');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (1, 'SUV', 2023, 86.99, 'Chevrolet Equinox', 'FFC0CB');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (2, 'SUV', 2016, 79.99, 'Honda CR-V', '080080');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (3, 'Pick-up', 2017, 90.99, 'Toyota Tacoma', '804800');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (4, 'Sedan', 2014, 49.99, 'Chevrolet Malibu', '808080');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (5, 'SUV', 2016, 75.99, 'Ford Escape', '800000');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (6, 'Sedan', 2019, 55.99, 'Nissan Altima', '008080');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (7, 'SUV', 2022, 89.99, 'Ford Explorer', '000080');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (8, 'Sports', 2021, 149.99, 'Chevrolet Corvette C8', 'FF0000');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (1, 'Pick-up', 2019, 89.99, 'Toyota Tundra', 'BEB7BE');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (2, 'Sports', 2020, 249.99, 'Ferrari 488 Pista', 'FFFF00');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (3, 'Sports', 2020, 299.99, 'Lamborghini Aventador', 'c60d7f');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (4, 'Sports', 2022, 199.99, 'Porsche 911', 'FFA500');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (5, 'Sports', 2023, 199.99, 'Audi R8', 'A52A2A');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (6, 'Sports', 2019, 149.99, 'BMW M3', 'FFC0CB');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (7, 'Sports', 2016, 199.99, 'Mercedes-Benz AMG GT', '1e1e1e');
INSERT INTO Car (company_id, type, year, daily_rate, name, color) VALUES (8, 'Sports', 2017, 249.99, 'McLaren 720S', 'd8a102');

# Rentals
INSERT INTO Rental (customer_id, car_id, rental_date, return_date) VALUES (1, 1, '2021-01-01', '2021-01-03');
INSERT INTO Rental (customer_id, car_id, rental_date, return_date) VALUES (2, 2, '2021-01-02', '2021-01-04');
INSERT INTO Rental (customer_id, car_id, rental_date, return_date) VALUES (3, 3, '2021-01-03', '2021-01-05');
INSERT INTO Rental (customer_id, car_id, rental_date, return_date) VALUES (4, 4, '2021-01-04', '2021-01-06');
INSERT INTO Rental (customer_id, car_id, rental_date, return_date) VALUES (5, 5, '2021-01-05', '2021-01-07');
INSERT INTO Rental (customer_id, car_id, rental_date, return_date) VALUES (6, 6, '2021-01-06', '2021-01-08');