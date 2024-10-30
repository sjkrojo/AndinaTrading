const { Router } = require('express');
const { db } = require('../firebase')
const CompanyDAO = require('../controller/companydao');
const StockDAO = require('../controller/stockdao');

const router = Router();
const companyDAO = new CompanyDAO();
const stockDAO = new StockDAO();

router.get('/', async (req, res) => {

    res.render('crudcompany')
})


router.post('/createcompany', async (req, res) => {

    const {company_name, company_country, company_city, product_name,  product_description,  product_value,  product_in_storage} = req.body;
    
    const processedname = company_name.replace(/\s+/g, '').toLowerCase();

    const stock = await stockDAO.createStock(product_name,product_description,new Date(), product_value, company_name, 0, product_in_storage);
    const newCompany = await companyDAO.createCompany(company_name, company_country, company_city, stock);
    console.log('Company created:', newCompany);
    res.render('crudcompany')
})

module.exports = router;