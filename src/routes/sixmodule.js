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

router.post('/crud/:id', async (req, res) => {

    const user = req.params;

    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countries: countries
    }

    res.render('sixthmodule', { data });
})


router.post('/confirmarinformacionbursatil/:id', async (req, res) => {
    const user = req.params;
    const { tipoInversionista, localizacion } = req.body;

    // Obtener el país por su ID
    const countrybyid = await countryDAO.getCountryById(localizacion);
    const countries = await countryDAO.getAllCountries();
    
    // Obtener los contratos de trading filtrados
    const trandings = await tradingContractDAO.getTradingContractsByRiskProfileAndLocation(tipoInversionista, localizacion);
    
    // Agregar countrybyid y stock a cada elemento de trandings
    const trandingsWithDetails = await Promise.all(trandings.map(async (tranding) => {
        // Obtener el stock usando el ID del contrato
        const stockDetails = await stockDAO.getStockById(tranding.stock); // Asumiendo que 'tranding.stock' es el ID del stock

        return {
            ...tranding,            // Spread operator para incluir las propiedades originales
            country: countrybyid,   // Agrega el objeto countrybyid
            stock: stockDetails     // Agrega el objeto stockDetails
        };
    }));

    console.log(trandingsWithDetails); // Log de los trandings con country y stock

    const data = {
        user: user,
        trandingsWithCountry: trandingsWithDetails, // Usa el nuevo array con country y stock
        countries: countries
    };

    res.render('sixthmodule', { data });
});




module.exports = router;