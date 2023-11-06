import {createCustomer, generateFakeCustomers, getCustomerById, getCustomers} from "../queries/customerQueries";
import router from "express";
const customerRouter = router.Router();

/**
 * Get all the customers
 */
customerRouter.get('/', async (req, res) => {
    const customers = await getCustomers();
    res.status(200).json(customers);
});

/**
 * Get a customer by id
 */
customerRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await getCustomerById(parseInt(id));
        res.status(200).json(customer);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a customer
 */
customerRouter.post('/', async (req, res) => {
    try {
        const customer = await createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

/**
 * Generate fake customers
 */
customerRouter.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        await generateFakeCustomers(amount);
        const customers = await getCustomers();
        res.status(201).json(customers);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export { customerRouter };