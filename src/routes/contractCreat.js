const express = require('express');
const router = express.Router();
const UserDAO = require('../controller/userdao');
const InvestorDAO = require('../controller/investordao');
const TradingContractDAO = require('../controller/tradingcontractdao');
const SecurityHouseDAO = require('../controller/securityhousedao');
const StockDAO = require('../controller/stockdao');
const CountryDAO = require('../controller/countrydao');
const CompanyDAO = require('../controller/companydao');
const StockInvestorDAO = require('../controller/stockinvestordao');


// Inicialización de DAOs
const userDAO = new UserDAO();
const investorDAO = new InvestorDAO();
const tradingContractDAO = new TradingContractDAO();
const securityHouseDAO = new SecurityHouseDAO();
const stockDAO = new StockDAO();
const countryDAO = new CountryDAO();
const companyDAO = new CompanyDAO();
const stockinvestordao = new StockInvestorDAO();

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
    const { name, gmail, address, phone, investmentCapacity, amount, type, expirationDate, terms, mostrar, idaccion } = req.body;

    const houseshow = await securityHouseDAO.getSecurityHouseById(mostrar);
    const accion = await stockDAO.getStockById(idaccion);

    user = await userDAO.createUser(gmail, generateRandomPassword(), "investor", "investor");
    investor = await investorDAO.createInvestor({ name, address, phone, investmentCapacity });
    console.log(houseshow);
    console.log(investor);
    await tradingContractDAO.createTradingContract(accion.id, expirationDate, terms, false, amount, type, houseshow.id, investor);

    res.render('secondmodule');

});

// Ruta de creacion para personas que tienen usuario
router.post('/creacionContrato/:id', async (req, res) => {
    const { name, gmail, address, phone, investmentCapacity, amount, type, expirationDate, terms, mostrar, idaccion } = req.body;

    const user = req.params;
    const houseshow = await securityHouseDAO.getSecurityHouseById(mostrar);
    const accion = await stockDAO.getStockById(idaccion);
    console.log("prueba");
    const usert = await userDAO.getUserById(user.id);
    console.log(usert);
    const investor = await investorDAO.getInvestorById(usert.idtype);
    console.log(houseshow);
    console.log(investor);

    await tradingContractDAO.createTradingContract(accion.id, expirationDate, terms, false, amount, type, houseshow.id, investor);


    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countries: countries
    }
    res.render('secondmodule', { data })
});


// Ruta para crear un contrato de venta para usuarios registrados
router.post('/ventaContrato/:id', async (req, res) => {

    const { stock, amount, orderType } = req.body;    // Extraer los datos necesarios del cuerpo de la solicitud
    const user = req.params;

    const currentDate = new Date();    // Obtener la fecha actual y sumar 3 meses 
    currentDate.setMonth(currentDate.getMonth() + 3);
    const expirationDate = currentDate;

    const houses = await securityHouseDAO.getSecurityHouses(); // Obtener todos los security house
    const terms = "Al generar este contrato aceptas los terminos y condiciones."; //Terminos del contrato

    const usersecu = await userDAO.getUserById(user.id); // Obtener información del usuario a partir de su ID

    // Obtener la información de la acción específica usando el ID del usuario y el ID de la acción
    const selectedStock = await stockinvestordao.getStockById(usersecu.idtype, stock);

    // Obtener información adicional sobre la acción y la empresa asociada
    const stockInfo = await stockDAO.getStockById(selectedStock.stockId);
    const companyInfo = await companyDAO.getCompanyByName(stockInfo.company);

    // Obtener información del inversionista usando el tipo de ID del usuario
    const investor = await investorDAO.getInvestorById(usersecu.idtype);

    const countryid = await countryDAO.getCountryIdByNameAndCity(companyInfo.name, companyInfo.country)
    // Filtrar las casas de seguridad según el país y la ciudad de companyInfo
    const filteredHouses= await securityHouseDAO.getSecurityHousesByLocation(countryid);

    // Obtener solo los IDs de las casas de seguridad filtradas
    const houseIds = filteredHouses.map(house => house.id);

    // Obtener la información detallada de cada casa de seguridad usando sus IDs
    const houseDefinitive = await Promise.all(
        houseIds.map(id => securityHouseDAO.getSecurityHouseById(id))
    );

    try {
        // Crear el contrato de venta trading
        await tradingContractDAO.createTradingContract(user.id, expirationDate, terms, false, amount, orderType, houseDefinitive, investor);

        const data = {
            user: user,
        };

        res.send(`
    <form id="redirectForm" action="/backtomenu/${user.id}" method="POST" style="display: none;">
        <input type="hidden" name="userId" value="${user.id}">
    </form>
    <script>
        document.getElementById('redirectForm').submit();
    </script>
`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el contrato');
    }
});

function generateRandomPassword() {
    return Math.random().toString(36).slice(-8); // Contraseña aleatoria de 8 caracteres
}

module.exports = router;