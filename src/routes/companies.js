const { Router } = require('express');
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

    const companycheck = await companyDAO.isCompanyNameInUse(company_name);
    const stockcheck = await stockDAO.isStockNameInUse(product_name);

    if(companycheck||stockcheck){

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
    const { idcompany, idstock,company_name, company_country, company_city, product_name,  product_description,  product_value,  product_in_storage} = req.body;

    const companycheck = await companyDAO.isCompanyNameInUse(company_name);
    const stockcheck = await stockDAO.isStockNameInUse(product_name);

    if(companycheck || stockcheck){

        const companies = await companyDAO.getCompanies();
        const data = {
            user: user,
            companies: companies,
            message: "ERROR"
        }
        res.render('crudcompany',  {data})
}else{
    const updatecompany = await companyDAO.updateCompany(idcompany, company_name, company_country, company_city, idstock, product_name, product_description, new Date(), product_value, company_name, product_in_storage)
    const companies = await companyDAO.getCompanies();
    const data = {
        user: user,
        companies: companies
    }
    res.render('crudcompany',  {data})
}
})

module.exports = router;