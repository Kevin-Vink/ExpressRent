const { getRentals, getRentalById, createRental, generateFakeRentals} = require("../queries/rentalQueries");
const router = require('express').Router();

/**
 * Get all the rentals
 */
router.get('/', async (req, res) => {
    const rentals = await getRentals();
    res.status(200).json(rentals);
});

/**
 * Get a rental by id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rental = await getRentalById(id);
        res.status(200).json(rental);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a rental
 */
router.post('/', async (req, res) => {
    try {
        const rental = await createRental(req.body);
        res.status(201).json(rental);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});



/**
 * Generate fake rentals
 */
router.post('/generate', async (req, res) => {
    try {
        const { amount } = req.body;
        await generateFakeRentals(amount);
        const rentals = await getRentals();
        res.status(201).json(rentals);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;