import {
    createCar,
    deleteAllCars,
    deleteCar,
    generateFakeCars,
    getCarById,
    getCars, getCarTypes, searchCars,
    updateCar
} from "../queries/carQueries";
import router from "express";
import {Car, Rental} from "../../common/types";
import {createRental} from "../queries/rentalQueries";
import {getCustomerById, getRandomCustomerId} from "../queries/customerQueries";
const carRouter = router.Router();

/**
 * Get all the cars
 */
carRouter.get('/', async (req, res) => {
    const cars = await getCars();
    res.status(200).json(cars);
});

/**
 * Get all car types
 */
carRouter.get('/types', async (req, res) => {
    try {
        const types = await getCarTypes();
        res.status(200).json(types);
    } catch (error) {
        console.log(error)
        res.status(404).json({error: error});
    }
});

/**
 * Search for cars by type, name, year, company name
 */
carRouter.get('/search', async (req, res) => {
    try {
        const {q, type, maxDailyPrice} = req.query;
        let cars: Car[]
        if (q == '' && type == 'all' && maxDailyPrice === '') cars = await getCars();
        else cars = await searchCars(q?.toString().toLowerCase(), type == 'all' ? '' : type?.toString().toLowerCase(), parseInt(maxDailyPrice?.toString()));
        res.status(200).json(cars);
    } catch (error) {
        res.status(404).json({error: error});
    }
});

/**
 * Get a car by id
 */
carRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const car = await getCarById(parseInt(id));
        res.status(200).json(car);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a car
 */
carRouter.post('/', async (req, res) => {
    try {
        const car = await createCar(req.body);
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({error: error.message});
        console.log(error)
    }
});

/**
 * Update a car
 */
carRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await updateCar(parseInt(id), req.body);
        const cars = await getCars();
        res.status(201).json(cars);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

/**
 *  Delete a car
 */
carRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCar(parseInt(id));
        const cars = await getCars();
        res.status(200).json(cars);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Delete all cars
 */
carRouter.delete('/', async (req, res) => {
    try {
        await deleteAllCars();
        const cars = await getCars();
        res.status(200).json(cars);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

/**
 * Rent a car
 */
carRouter.post('/:id/rent', async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.body;
        const randomCustomer = await getRandomCustomerId();
        const rental : Rental = {
            customer: await getCustomerById(randomCustomer),
            car: await getCarById(parseInt(id)),
            rental_date: new Date(startDate),
            return_date: new Date(endDate)
        }
        await createRental(rental);
        res.status(201).json();
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

/**
 * Generate fake cars
 */
carRouter.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        if (amount === undefined || amount < 1) throw new Error('Amount must be greater than 0');
        await generateFakeCars(amount);
        const cars = await getCars();
        res.status(201).json(cars);
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message});
    }
});

export { carRouter };