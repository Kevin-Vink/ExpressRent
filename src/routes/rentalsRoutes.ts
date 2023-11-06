import {createRental, generateFakeRentals, getRentalById, getRentals} from "../queries/rentalQueries";
import router from "express";
const rentalRouter = router.Router();

/**
 * Get all the rentals
 */
rentalRouter.get('/', async (req, res) => {
    const rentals = await getRentals();
    res.status(200).json(rentals);
});

/**
 * Get a rental by id
 */
rentalRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rental = await getRentalById(parseInt(id));
        res.status(200).json(rental);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a rental
 */
rentalRouter.post('/', async (req, res) => {
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
rentalRouter.post('/generate', async (req, res) => {
    try {
        const { amount } = req.body;
        await generateFakeRentals(amount);
        const rentals = await getRentals();
        res.status(201).json(rentals);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export { rentalRouter };