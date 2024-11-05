const { Router } = require('express');
const { db } = require('../firebase')
const UserDAO = require('../controller/userdao');
const InvestorDAO = require('../controller/investordao');
const TradingContractDAO = require('../controller/tradingcontractdao');
const CountryDAO = require('../controller/countrydao');
const StockInvestorDAO = require('../controller/stockinvestordao');
const StockDAO = require('../controller/stockdao');
const CompanyDAO = require('../controller/companydao');

const router = Router();
const userDAO = new UserDAO();
const countryDAO = new CountryDAO();
const investorDAO = new InvestorDAO();
const tradingContractDAO = new TradingContractDAO();
const stockInvestorDAO = new StockInvestorDAO();
const stockDAO = new StockDAO();
const companyDAO = new CompanyDAO();

router.get('/crud/:id', async (req, res) => {

    const user = req.params;

    const countries = await countryDAO.getAllCountries();

    const data = {
        countries: countries
    }

    res.render('sixthmodule', { data });
})



module.exports = router;