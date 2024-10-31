const { Router } = require('express');
const { db } = require('../firebase')
const CompanyDAO = require('../controller/companydao');
const StockDAO = require('../controller/stockdao');

const router = Router();
const companyDAO = new CompanyDAO();
const stockDAO = new StockDAO();

router.post('/crud/:id', async (req, res) => {

    const  user  = req.params;

    const companies = await companyDAO.getCompanies();

    const data = {
        user: user,
        companies: companies
    }
    res.render('crudcompany', {data})
})


router.post('/showcompany/:id', async (req, res) => {

    const  user  = req.params;
    const { mostrar } = req.body;

    const companyshow = await companyDAO.getCompanyById(mostrar);
    const companies = await companyDAO.getCompanies();

    const data = {
        user: user,
        companyshow:  companyshow,
        companies: companies
    }
    res.render('crudcompany', {data})
})


router.post('/createcompany/:id', async (req, res) => {

    const  user  = req.params;

    
    const {company_name, company_country, company_city, product_name,  product_description,  product_value,  product_in_storage} = req.body;

    if(companyDAO.isCompanyNameInUse(company_name) || stockDAO.isStockNameInUse(product_name)){

        const companies = await companyDAO.getCompanies();
        const data = {
            user: user,
            companies: companies,
            message: "ERROR"
        }
        res.render('crudcompany',  {data})
    }else{
    const stock = await stockDAO.createStock(product_name,product_description,new Date(), product_value, company_name, 0, product_in_storage);
    const newCompany = await companyDAO.createCompany(company_name, company_country, company_city, stock);
    const companies = await companyDAO.getCompanies();

    const data = {
        user: user,
        companies: companies
    }
    res.render('crudcompany',  {data})
    }
})

router.post('/deletecompany/:id', async (req, res) => {

    const  user  = req.params;
    const { eliminar } = req.body;
    console.log(eliminar);
    const deleteCompany = await companyDAO.deleteCompany(eliminar);
    const companies = await companyDAO.getCompanies();
    const data = {
        user: user,
        companies: companies
    }
    res.render('crudcompany', {data})

})

router.post('/editcompany/:id', async (req, res) => {

    const  user  = req.params;
    const { editar } = req.body;
    const company = await companyDAO.getCompanyById(editar);
    const data = {
        user: user,
        company: company
    }
    res.render('crudcompany', {data})

})


router.post('/update/:id', async (req, res) => {

    const  user  = req.params;
    const { company_name, company_country, company_city, product_name,  product_description,  product_value,  product_in_storage} = req.body;

    if(companyDAO.isCompanyNameInUse(company_name) || stockDAO.isStockNameInUse(product_name)){

        const companies = await companyDAO.getCompanies();
        const data = {
            user: user,
            companies: companies,
            message: "ERROR"
        }
        res.render('crudcompany',  {data})
}else{
    const companydto = await companyDAO.getCompanyByName(company_name);
    const stockdto = await stockDAO.getStockByName(product_name);
    const updatecompany = await stockDAO.updateCompany(companydto.id, company_name, company_country, company_city, stockdto.id, product_name, product_description, new Date(), product_value, company_name, product_in_storage)
    const companies = await companyDAO.getCompanies();
    const data = {
        user: user,
        companies: companies
    }
    res.render('crudcompany',  {data})
}
})

module.exports = router;