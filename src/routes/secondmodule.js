const { Router } = require('express');
const CountryDAO = require('../controller/countrydao');
const CompanyDAO = require('../controller/companydao');
const StockDAO = require('../controller/stockdao');

const router = Router();
const countryDAO = new CountryDAO();
const companyDAO = new CompanyDAO();
const stockDAO = new StockDAO();

router.post('/module/:id', async (req, res) => {

    const  user  = req.params;

    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countries: countries
    }
    res.render('secondmodule', {data})
})


router.post('/loadstocks/:id', async (req, res) => {

    const  user  = req.params;
    const { pais } = req.body;

    const country = await countryDAO.getCountryById(pais);

    const stocks = await companyDAO.getCompaniesByLocation(country.countryName, country.cityName);

    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        stocks: stocks,
        countries: countries
    }

    res.render('secondmodule', {data})
})


router.post('/selectaction/:id', async (req, res) => {

    const  user  = req.params;
    const { accion } = req.body;
    console.log(accion);


    const selectedStock = await stockDAO.getStockById(accion);
    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        selectedStock: selectedStock,
        countries: countries
    }

    res.render('secondmodule', {data})
})






module.exports = router;