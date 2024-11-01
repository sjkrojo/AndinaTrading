const express = require('express');
const router = express.Router();
const UserDAO = require('../controller/userdao');
const InvestorDAO = require('../controller/investordao');
const TradingContractDAO = require('../controller/tradingcontractdao');
const SecurityHouseDAO = require('../controller/securityhousedao');
const StockDAO = require('../controller/stockdao');
const CountryDAO = require('../controller/countrydao');

// Inicialización de DAOs
const userDAO = new UserDAO();
const investorDAO = new InvestorDAO();
const tradingContractDAO = new TradingContractDAO();
const securityHouseDAO = new SecurityHouseDAO();
const stockDAO = new StockDAO();
const countryDAO = new CountryDAO();

router.post('/crud/:id', async (req, res) => {

    const user = req.params;
    const houses = await securityHouseDAO.getSecurityHouses();

    const data = {
        user: user,
        houses: houses
    };
    res.render('generacionContratosModule', { data });
});

// Ruta de creacion para personas que no tienen usuario
router.post('/creacionContrato', async (req, res) => {
    const { name, gmail, address, phone, investmentCapacity, amount,type,expirationDate, terms, mostrar, idaccion} = req.body;
    
    const houseshow = await securityHouseDAO.getSecurityHouseById(mostrar);
    const accion = await stockDAO.getStockById(idaccion);

        user = await userDAO.createUser(gmail, generateRandomPassword(), "investor", "investor");
        investor = await investorDAO.createInvestor({ name, address, phone, investmentCapacity });
        console.log(houseshow);
        console.log(investor);
        await tradingContractDAO.createTradingContract(accion.id, expirationDate, terms, false,amount,type,houseshow, investor);

    res.render('secondmodule');

});

// Ruta de creacion para personas que tienen usuario
router.post('/creacionContrato/:id', async (req, res) => {
    const { name, gmail, address, phone, investmentCapacity, amount,type,expirationDate, terms, mostrar, idaccion} = req.body;
    
    const user = req.params;
    const houseshow = await securityHouseDAO.getSecurityHouseById(mostrar);
    const accion = await stockDAO.getStockById(idaccion);
        console.log("prueba");
        const usert = await userDAO.getUserById(user.id);
        console.log(usert);
        const investor = await investorDAO.getInvestorById(usert.idtype);
        console.log(houseshow);
        console.log(investor);

        await tradingContractDAO.createTradingContract(accion.id, expirationDate, terms, false,amount,type,houseshow, investor);


        const countries = await countryDAO.getAllCountries();
    
        const data = {
            user: user,
            countries: countries
        }
        res.render('secondmodule', { data })
});

function generateRandomPassword() {
    return Math.random().toString(36).slice(-8); // Contraseña aleatoria de 8 caracteres
}

module.exports = router;