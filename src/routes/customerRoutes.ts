import {
    createCustomer, deleteCustomer,
    generateFakeCustomers,
    getCustomerById,
    getCustomers,
    searchCustomers, updateCustomer
} from "../queries/customerQueries";
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
 * Search for customers
 */
customerRouter.get('/search', async (req, res) => {
    try {
        const {q} = req.query;
        if (q === '') res.status(200).json(await getCustomers());
        else res.status(200).json(await searchCustomers(q.toString().toLowerCase()));
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

/**
 * Get a customer by id
 */
customerRouter.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const customer = await getCustomerById(parseInt(id));
        res.status(200).json(customer);
    } catch (error) {
        res.status(404).json({error: error.message});
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
 * Update a customer
 */
customerRouter.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const customer = await updateCustomer(parseInt(id), req.body);
        res.status(200).json(customer);
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message});
    }
});

/**
 * Delete a customer
 */
customerRouter.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await deleteCustomer(parseInt(id));
        res.status(204).json();
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
        if (amount === undefined || amount < 1) throw new Error('Amount must be greater than 0');
        await generateFakeCustomers(amount);
        const customers = await getCustomers();
        res.status(201).json(customers);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export {customerRouter};