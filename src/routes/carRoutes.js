const {getCars, getCarById, generateFakeCars, createCar} = require("../queries/carQueries");
const router = require('express').Router();

/**
 * Get all the cars
 */
router.get('/', async (req, res) => {
    const cars = await getCars();
    res.status(200).json(cars);
});

/**
 * Get a car by id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const car = await getCarById(id);
        res.status(200).json(car);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a car
 */
router.post('/', async (req, res) => {
    try {
        const car = await createCar();
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({error: error.message});
        console.log(error)
    }
});

/**
 * Generate fake cars
 */
router.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        await generateFakeCars(amount);
        const cars = await getCars();
        res.status(201).json(cars);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;