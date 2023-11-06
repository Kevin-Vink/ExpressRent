const {getCompanies, getCompanyById, generateFakeCompanies, createCompany} = require("../queries/companyQueries");
const router = require('express').Router();

/**
 * Get all the companies
 */
router.get('/', async (req, res) => {
    const companies = await getCompanies();
    res.status(200).json(companies);
});

/**
 * Get a company by id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const company = await getCompanyById(id);
        res.status(200).json(company);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a company
 */
router.post('/', async (req, res) => {
    try {
        const company = await createCompany();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({error: error.message});
        console.log(error)
    }
});

/**
 * Generate fake companies
 */
router.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        await generateFakeCompanies(amount);
        const companies = await getCompanies();
        res.status(201).json(companies);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;