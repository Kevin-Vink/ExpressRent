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
    daily_rate DECIMAL(5,2) NOT NULL DEFAULT 25.00,
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

# INSERT INTO Company(name) VALUES('Hertz');
# INSERT INTO Company(name) VALUES('Avis');
# INSERT INTO Company(name) VALUES('Alamo');
#
# INSERT INTO Customer(name) VALUES('John Smith');
# INSERT INTO Customer(name) VALUES('Jane Doe');
# INSERT INTO Customer(name) VALUES('Bob Jones');
# INSERT INTO Customer(name) VALUES('Sally Smith');
# INSERT INTO Customer(name) VALUES('Bill Jones');
# INSERT INTO Customer(name) VALUES('Mary Doe');
#
# INSERT INTO Car(name, company_id, year, type) VALUES('Ford Focus', 1, 2017, 'Hatchback');
# INSERT INTO Car(name, company_id, year, type) VALUES('Ford Fusion', 1, 2016, 'Sedan');
# INSERT INTO Car(name, company_id, year, type) VALUES('Ford Mustang', 3, 2022, 'Coupe');
# INSERT INTO Car(name, company_id, year, type) VALUES('Chevy Malibu', 2, 2019, 'Sedan');
# INSERT INTO Car(name, company_id, year, type) VALUES('Chevy Impala', 2, 2018, 'Sedan');
# INSERT INTO Car(name, company_id, year, type) VALUES('Chevy Camaro', 3, 2023, 'Coupe');
# INSERT INTO Car(name, company_id, year, type) VALUES('Chevy Tahoe', 2, 2020, 'SUV');
# INSERT INTO Car(name, company_id, year, type) VALUES('Ford Expedition', 1, 2021, 'SUV');
#
# INSERT INTO Rental(customer_id, car_id, daily_rate, rental_date, return_date) VALUES(1, 1, 35.00, '2023-01-01', '2023-01-03');
# INSERT INTO Rental(customer_id, car_id, daily_rate, rental_date, return_date) VALUES(2, 2 , 30.00, '2023-01-04', '2023-01-06');
# INSERT INTO Rental(customer_id, car_id, daily_rate, rental_date, return_date) VALUES(3, 3, 55.00, '2023-01-07', '2023-01-09');
# INSERT INTO Rental(customer_id, car_id, daily_rate, rental_date, return_date) VALUES(4, 4, 25.00, '2023-01-10', '2023-01-12');
# INSERT INTO Rental(customer_id, car_id, daily_rate, rental_date, return_date) VALUES(5, 5, 27.50, '2023-01-13', '2023-01-15');
# INSERT INTO Rental(customer_id, car_id, daily_rate, rental_date, return_date) VALUES(6, 6, 60.00, '2023-01-16', '2023-01-18');

# SELECT Rental.rental_date, Rental.return_date, Car.year, Car.color, Car.type, Rental.daily_rate, Customer.name, Car.name, Company.name FROM Rental INNER JOIN Customer ON Rental.customer_id = Customer.id INNER JOIN Car ON Rental.car_id = Car.id INNER JOIN Company ON Car.company_id = Company.id;
#
# SELECT type, name, year FROM Car;