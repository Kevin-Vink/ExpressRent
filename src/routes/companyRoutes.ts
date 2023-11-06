import {createCompany, generateFakeCompanies, getCompanies, getCompanyById} from "../queries/companyQueries";
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
 * Generate fake companies
 */
companyRouter.post('/generate', async (req, res) => {
    try {
        const {amount} = req.body;
        await generateFakeCompanies(amount);
        const companies = await getCompanies();
        res.status(201).json(companies);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export { companyRouter };