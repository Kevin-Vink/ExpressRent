const {getCustomers, getCustomerById, createCustomer, generateFakeCustomers} = require("../queries/customerQueries");
const router = require('express').Router();

/**
 * Get all the customers
 */
router.get('/', async (req, res) => {
    const customers = await getCustomers();
    res.status(200).json(customers);
});

/**
 * Get a customer by id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await getCustomerById(id);
        res.status(200).json(customer);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a customer
 */
router.post('/', async (req, res) => {
    try {
        const {name, age} = req.body;
        const customer = await createCustomer(name, age);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({error: error.message});
        console.log(error)
    }
});

/**
 * Generate fake customers
 */
router.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        await generateFakeCustomers(amount);
        const customers = await getCustomers();
        res.status(201).json(customers);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;