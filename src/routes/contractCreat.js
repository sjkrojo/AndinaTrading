const express = require('express');
const router = express.Router();
const UserDAO = require('../controller/userdao');
const InvestorDAO = require('../controller/investordao');
const TradingContractDAO = require('../controller/tradingcontractdao');
const SecurityHouseDAO = require('../controller/securityhousedao');
const SecurityHouseDTO = require('../model/securityhousedto')

// Inicialización de DAOs
const userDAO = new UserDAO();
const investorDAO = new InvestorDAO();
const tradingContractDAO = new TradingContractDAO();
const securityHouseDAO = new SecurityHouseDAO();

router.post('/crud/:id', async (req, res) => {

    const user = req.params;
    const houses = await securityHouseDAO.getSecurityHouses();

    const data = {
        user: user,
        houses: houses
    };
    res.render('generacionContratosModule', { data });
});

// Ruta para crear el contrato de negociación y el inversionista
router.post('/creacionContrato/:id', async (req, res) => {
    const { name, gmail, address, phone, investmentCapacity, stock, expirationDate, terms, houseshow } = req.body;
    
    // Verificar si el usuario ya existe
    let user = await userDAO.getUserByEmail(gmail);

    if (!user) {
        user = await userDAO.createUser(gmail, generateRandomPassword(), "investor", "investor");
        investor = await investorDAO.createInvestor({ name, address, phone, investmentCapacity });
        await tradingContractDAO.createTradingContract(stock, expirationDate, terms, false, houseshow, investor.id);

    } else {
        const userDoc = await userDAO.getUserById(user.id);  
        console.log("ID del usuario obtenido:", userDoc.id);
        await tradingContractDAO.createTradingContract(stock, expirationDate, terms, false, houseshow, userDoc);
    }
});


function generateRandomPassword() {
    return Math.random().toString(36).slice(-8); // Contraseña aleatoria de 8 caracteres
}


router.post('/showhouse/:id', async (req, res) => {

    const user = req.params;
    const { mostrar } = req.body;

    const houseshow = await securityHouseDAO.getSecurityHouseById(mostrar);
    const houses = await securityHouseDAO.getSecurityHouses(); 

    const data = {
        user: user,
        houseshow: houseshow,
        houses: houses 
    }

    console.log(houseshow);
    res.render('generacionContratosModule', { data })

});

module.exports = router;