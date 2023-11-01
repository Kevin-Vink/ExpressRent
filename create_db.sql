DROP DATABASE IF EXISTS Rentals;
CREATE DATABASE Rentals;

use Rentals;

CREATE TABLE Company(
    CompanyID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CompanyName VARCHAR(255) NOT NULL
);

CREATE TABLE Customer(
    CustomerID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CustomerName VARCHAR(255) NOT NULL,
    Age INT NOT NULL DEFAULT 18
);

CREATE TABLE Car(
    CarID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CompanyID INT NOT NULL REFERENCES Company(CompanyID) ON DELETE CASCADE,
    CarType VARCHAR(255) NOT NULL DEFAULT 'Sedan',
    ProductionYear YEAR NOT NULL,
    CarName VARCHAR(255) NOT NULL,
    CarColor VARCHAR(6) NOT NULL DEFAULT '000000'
);

CREATE TABLE Rental(
    RentalID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    CarID INT NOT NULL REFERENCES Car(CarID) ON DELETE CASCADE,
    DailyRate DECIMAL(5,2) NOT NULL DEFAULT 25.00,
    RentalDate DATE NOT NULL,
    ReturnDate DATE NOT NULL
);

INSERT INTO Company(CompanyName) VALUES('Hertz');
INSERT INTO Company(CompanyName) VALUES('Avis');
INSERT INTO Company(CompanyName) VALUES('Alamo');

INSERT INTO Customer(CustomerName) VALUES('John Smith');
INSERT INTO Customer(CustomerName) VALUES('Jane Doe');
INSERT INTO Customer(CustomerName) VALUES('Bob Jones');
INSERT INTO Customer(CustomerName) VALUES('Sally Smith');
INSERT INTO Customer(CustomerName) VALUES('Bill Jones');
INSERT INTO Customer(CustomerName) VALUES('Mary Doe');

INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Ford Focus', 1, 2017, 'Hatchback');
INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Ford Fusion', 1, 2016, 'Sedan');
INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Ford Mustang', 3, 2022, 'Coupe');
INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Chevy Malibu', 2, 2019, 'Sedan');
INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Chevy Impala', 2, 2018, 'Sedan');
INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Chevy Camaro', 3, 2023, 'Coupe');
INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Chevy Tahoe', 2, 2020, 'SUV');
INSERT INTO Car(CarName, CompanyID, ProductionYear, CarType) VALUES('Ford Expedition', 1, 2021, 'SUV');

INSERT INTO Rental(CustomerID, CarID, DailyRate, RentalDate, ReturnDate) VALUES(1, 1, 35.00, '2023-01-01', '2023-01-03');
INSERT INTO Rental(CustomerID, CarID, DailyRate, RentalDate, ReturnDate) VALUES(2, 2 , 30.00, '2023-01-04', '2023-01-06');
INSERT INTO Rental(CustomerID, CarID, DailyRate, RentalDate, ReturnDate) VALUES(3, 3, 55.00, '2023-01-07', '2023-01-09');
INSERT INTO Rental(CustomerID, CarID, DailyRate, RentalDate, ReturnDate) VALUES(4, 4, 25.00, '2023-01-10', '2023-01-12');
INSERT INTO Rental(CustomerID, CarID, DailyRate, RentalDate, ReturnDate) VALUES(5, 5, 27.50, '2023-01-13', '2023-01-15');
INSERT INTO Rental(CustomerID, CarID, DailyRate, RentalDate, ReturnDate) VALUES(6, 6, 60.00, '2023-01-16', '2023-01-18');

SELECT Rental.RentalDate, Rental.ReturnDate, Car.ProductionYear, Car.CarColor, Car.CarType, Rental.DailyRate, Customer.CustomerName, Car.CarName, Company.CompanyName FROM Rental INNER JOIN Customer ON Rental.CustomerID = Customer.CustomerID INNER JOIN Car ON Rental.CarID = Car.CarID INNER JOIN Company ON Car.CompanyID = Company.CompanyID;

SELECT CarType, CarName, ProductionYear FROM Car;