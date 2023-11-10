import {
    createCompany, deleteCompany,
    generateFakeCompanies,
    getCompanies,
    getCompanyById,
    searchCompanies, updateCompany
} from "../queries/companyQueries";
import router from 'express';
const companyRouter = router.Router();

/**
 * Get all the companies
 */
companyRouter.get('/', async (req, res) => {
    const companies = await getCompanies();
    res.status(200).json(companies);
});

/**
 * Search for a company/companies
 */
companyRouter.get('/search', async (req, res) => {
    try {
        const {q} = req.query;
        if (q == '') res.status(200).json(await getCompanies());
        else res.status(200).json(await searchCompanies(q.toString().toLowerCase()));
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Get a company by id
 */
companyRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const company = await getCompanyById(parseInt(id));
        res.status(200).json(company);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * Create a company
 */
companyRouter.post('/', async (req, res) => {
    try {
        const company = await createCompany(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({error: error.message});
        console.log(error)
    }
});

/**
 * Update a company
 */
companyRouter.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const company = await updateCompany(parseInt(id), req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

/**
 * Delete a company
 */
companyRouter.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await deleteCompany(parseInt(id));
        const companies = await getCompanies();
        res.status(200).json(companies);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


/**
 * Generate fake companies
 */
companyRouter.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        if (amount === undefined || amount < 1) throw new Error('Amount must be greater than 0');
        await generateFakeCompanies(amount);
        const companies = await getCompanies();
        res.status(201).json(companies);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export { companyRouter };