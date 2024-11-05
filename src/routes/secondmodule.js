const { Router } = require('express');
const CountryDAO = require('../controller/countrydao');
const CompanyDAO = require('../controller/companydao');
const StockDAO = require('../controller/stockdao');
const SecurityHouseDAO = require('../controller/securityhousedao');
const UserDAO = require('../controller/userdao');
const InvestorDAO = require('../controller/investordao');



const router = Router();
const countryDAO = new CountryDAO();
const companyDAO = new CompanyDAO();
const stockDAO = new StockDAO();
const securityhouseDAO = new SecurityHouseDAO();
const userDAO = new UserDAO();
const investorDAO = new InvestorDAO();

router.post('/module/:id', async (req, res) => {

    const user = req.params;

    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countries: countries
    }
    res.render('secondmodule', { data })
})


router.post('/loadstocks/:id', async (req, res) => {

    const user = req.params;
    const { pais } = req.body;

    const country = await countryDAO.getCountryById(pais);

    const stocks = await companyDAO.getCompaniesByLocation(country.countryName, country.cityName);

    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        stocks: stocks,
        countries: countries
    }

    res.render('secondmodule', { data })
})


router.post('/selectaction/:id', async (req, res) => {

    const user = req.params;
    const { accion } = req.body;
    console.log(accion);


    const selectedStock = await stockDAO.getStockById(accion);
    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        selectedStock: selectedStock,
        countries: countries
    }

    res.render('secondmodule', { data })
})


router.post('/buyStock/:id', async (req, res) => {
    const user = req.params;
    const { accionid } = req.body;
    const userData = await userDAO.getUserById(user.id);
    const investorData = await investorDAO.getInvestorById(userData.idtype);
    const houses = await securityhouseDAO.getSecurityHouses();

    const selectedStock = await stockDAO.getStockById(accionid);
    const companyInfo = await companyDAO.getCompanyByName(selectedStock.company);

    const countryid = await countryDAO.getCountryIdByNameAndCity(companyInfo.name, companyInfo.country)
    // Filtrar las casas de seguridad según el país y la ciudad de companyInfo
    const filteredHouses= await securityhouseDAO.getSecurityHousesByLocation(countryid);
    
    const data = {
        user: user,
        userData: userData,
        houses: filteredHouses, 
        investorData: investorData,
        selectedStock: selectedStock
    }

    res.render('generacionContratosModule', { data });
});


router.post('/module/', async (req, res) => {


    const countries = await countryDAO.getAllCountries();

    const data = {
        countries: countries
    }
    res.render('secondmodule', { data })
})


router.post('/loadstocks/', async (req, res) => {

    const { pais } = req.body;

    const country = await countryDAO.getCountryById(pais);

    const stocks = await companyDAO.getCompaniesByLocation(country.countryName, country.cityName);

    const countries = await countryDAO.getAllCountries();

    const data = {
        stocks: stocks,
        countries: countries
    }

    res.render('secondmodule', { data })
})


router.post('/selectaction/', async (req, res) => {

    const { accion } = req.body;
    console.log(accion);


    const selectedStock = await stockDAO.getStockById(accion);
    const countries = await countryDAO.getAllCountries();

    const data = {
        selectedStock: selectedStock,
        countries: countries
    }

    res.render('secondmodule', { data })
})


router.post('/buyStock/', async (req, res) => {

    const { accionid } = req.body;
    const houses = await securityhouseDAO.getSecurityHouses();
   
    const selectedStock = await stockDAO.getStockById(accionid);
    const companyInfo = await companyDAO.getCompanyByName(selectedStock.company);
    const countryid = await countryDAO.getCountryIdByNameAndCity(companyInfo.name, companyInfo.country)
    // Filtrar las casas de seguridad según el país y la ciudad de companyInfo
    const filteredHouses= await securityhouseDAO.getSecurityHousesByLocation(countryid);
    
    
    const data = {
        selectedStock: selectedStock,
        houses: filteredHouses
    }

    res.render('generacionContratosModule', { data });

})





module.exports = router;