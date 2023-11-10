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
import {Car} from "../../common/types";
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
        const {q, type} = req.query;
        let cars: Car[]
        if (q == '' && type == 'all') cars = await getCars();
        else cars = await searchCars(q.toString().toLowerCase(), type == 'all' ? '' : type.toString().toLowerCase());
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
 * Generate fake cars
 */
carRouter.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        await generateFakeCars(amount);
        const cars = await getCars();
        res.status(201).json(cars);
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message});
    }
});

export { carRouter };