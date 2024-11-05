const { Router } = require('express');
const CompanyDAO = require('../controller/companydao');
const StockDAO = require('../controller/stockdao');
const LogsDAO = require('../controller/logdao');
const logsdao = new LogsDAO();

const CountryDAO = require('../controller/countrydao');
const countryDAO = new CountryDAO();
const router = Router();
const companyDAO = new CompanyDAO();
const stockDAO = new StockDAO();

router.post('/crud/:id', async (req, res) => {

    const  user  = req.params;

    const companies = await companyDAO.getCompanies();
    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countries: countries,
        companies: companies
    }
    res.render('crudcompany', {data})
})


router.post('/showcompany/:id', async (req, res) => {

    const  user  = req.params;
    const { mostrar } = req.body;

    const companyshow = await companyDAO.getCompanyById(mostrar);
    const companies = await companyDAO.getCompanies();
    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countries, countries,
        companyshow:  companyshow,
        companies: companies
    }
    logsdao.createLog("SHOW", "Visualización de la compañía " + mostrar, new Date(), "Se mostró la compañía con ID " + mostrar + " por el usuario con ID " + user.id);
    res.render('crudcompany', {data})
})


router.post('/createcompany/:id', async (req, res) => {

    const  user  = req.params;

    
    const {company_name, location, product_name,  product_description,  product_value,  product_in_storage} = req.body;

    const companycheck = await companyDAO.isCompanyNameInUse(company_name);
    const stockcheck = await stockDAO.isStockNameInUse(product_name);
    const countries = await countryDAO.getAllCountries();
    const country = await countryDAO.getCountryById(location);
    if(companycheck||stockcheck){

        const companies = await companyDAO.getCompanies();
        const data = {
            user: user,
            countries: countries,
            companies: companies,
            message: "ERROR"
        }
        logsdao.createLog("CREATE", "Creación de " + company_name, new Date(), "Se creó la compañía con el producto " + product_name + " por el usuario con ID " + user.id);
        res.render('crudcompany',  {data})
    }else{


    const stock = await stockDAO.createStock(product_name,product_description,new Date(), product_value, company_name, 0, product_in_storage);
    const newCompany = await companyDAO.createCompany(company_name, country.countryName, country.cityName, stock);
    const companies = await companyDAO.getCompanies();

    const data = {
        user: user,
        countries: countries,
        companies: companies
    }

    logsdao.createLog("CREATE", "Creacion"+ company_name, new Date(), "Se creo con la compañia" +product_name+ "por el usuario con ID" + user.id);
    res.render('crudcompany',  {data})
    }
})

router.post('/deletecompany/:id', async (req, res) => {

    const  user  = req.params;
    const { eliminar } = req.body;
    const countries = await countryDAO.getAllCountries();
    const deleteCompany = await companyDAO.deleteCompany(eliminar);
    const companies = await companyDAO.getCompanies();
    const data = {
        user: user,
        countries: countries,
        companies: companies
    }
    logsdao.createLog("DELETE", "Eliminación de la compañía " + eliminar, new Date(), "Se eliminó la compañía con ID " + eliminar + " por el usuario con ID " + user.id);
    res.render('crudcompany', {data})
})

router.post('/editcompany/:id', async (req, res) => {

    const  user  = req.params;
    const { editar } = req.body;
    const countries = await countryDAO.getAllCountries();
    const company = await companyDAO.getCompanyById(editar);
    const data = {
        user: user,
        countries: countries,
        company: company
    }
    
    res.render('crudcompany', {data})

})


router.post('/update/:id', async (req, res) => {

    const  user  = req.params;
    const { idcompany, idstock,location, product_name,  product_description,  product_value,  product_in_storage} = req.body;

    const countries = await countryDAO.getAllCountries();
    const stockcheck = await stockDAO.isStockNameInUse(product_name);
    const country = await countryDAO.getCountryById(location);
    const companies = await companyDAO.getCompanies();
    if( stockcheck){

        const companies = await companyDAO.getCompanies();
        const data = {
            user: user,
            countries: countries,
            companies: companies,
            message: "ERROR"
        }
        res.render('crudcompany',  {data})
}else{
    const updatecompany = await companyDAO.updateCompany(idcompany, country.countryName, country.cityName, company_city, idstock, product_name, product_description, new Date(), product_value, company_name, product_in_storage)
    const countries = await countryDAO.getAllCountries();
    const companies = await companyDAO.getCompanies();
    const data = {
        user: user,
        countries: countries,
        companies: companies
    }
    logsdao.createLog("UPDATE", "Actualización de la compañía " + idcompany, new Date(), "Se actualizó la compañía con ID " + idcompany + " y el producto " + product_name + " por el usuario con ID " + user.id);
    res.render('crudcompany',  {data})
}
})

module.exports = router;