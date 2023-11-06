import {createCar, generateFakeCars, getCarById, getCars} from "../queries/carQueries";
import router from "express";
const carRouter = router.Router();

/**
 * Get all the cars
 */
carRouter.get('/', async (req, res) => {
    const cars = await getCars();
    res.status(200).json(cars);
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
 * Generate fake cars
 */
carRouter.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        await generateFakeCars(amount);
        const cars = await getCars();
        res.status(201).json(cars);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export { carRouter };