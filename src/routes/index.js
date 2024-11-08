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

router.get('/', async (req, res) => {


    const countries = await countryDAO.getAllCountries();

    const data = {
        countries: countries
    }

    res.render('secondmodule', { data });
})

router.get('/lg', async (req, res) => {

    res.render('index');
})

router.post('/backtomenu/:id', async (req, res) => {
    const userId = req.params.id; // Extrae el ID del parámetro
    const user = await userDAO.getUserById(userId); // Pasa solo el ID a la función

    if (!user) {
        return res.status(404).send('User not found'); // Manejo de caso en que no se encuentra el usuario
    }

    const typeuser = user.type; // Accede al tipo de usuario desde el objeto retornado


    if (typeuser === 'admin') {
        res.render('menuadmin', { user });
    } else if (typeuser === 'securityhouse') {

        const tradingcontractsexpired = await tradingContractDAO.checkAndMoveExpiredContracts(user.idtype);
        const tradingcontracts = await tradingContractDAO.getContractsBySecurityHouseId(user.idtype);
        const historyContracts = await tradingContractDAO.getAllTradingContractsHistory()
        const data = {
            user: user,
            historyContracts: historyContracts,
            tradingcontracts: tradingcontracts
        }

        res.render('fithmodule', { data });


    } else if (typeuser === 'investor') {
        const stocks = await stockInvestorDAO.getAllStocksForInvestor(user.idtype);

        if (Array.isArray(stocks)) {
            const stockData = await Promise.all(stocks.map(async (stock) => {

                const company = await stockDAO.getStockById(stock.stockId);
                const companyName = company.name;
                const companyHistoricalData = company.historicalData;
                const totalValue = stock.quantity * stock.actualPrice;

                return {
                    id: stock.id,
                    date: stock.date,
                    originalPrice: stock.originalPrice,
                    quantity: stock.quantity,
                    stockId: stock.stockId,
                    actualPrice: stock.actualPrice,
                    companyName: companyName,
                    companyHistoricalData: companyHistoricalData,
                    totalValue: totalValue 
                    
                };
            }));

            // Calcular ganancias totales como la suma de los valores de cada acción
            const totalGains = stockData.reduce((sum, stock) => sum + stock.totalValue, 0);

        res.render('fourthmodule', { user, stocks: stockData, totalGains,});
    } else {
        res.status(400).send('Invalid user type'); // Manejo de tipos de usuario no válidos
    }
}
});


router.post('/firstmodule/:id', async (req, res) => {

    const user = req.params;

    res.render('firstmodule', { user });
})

router.post('/menuadmin/:id', async (req, res) => {

    const user = req.params;

    res.render('menuadmin', { user });
})

router.post('/reports/:id', async (req, res) => {
    const user = req.params;
    const countries = await countryDAO.getAllCountries(); 

    res.render('reports', { user, countries }); 
});


router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    const isAuthenticated = await userDAO.authenticateUser(email, password);
    if (isAuthenticated) {

        const type = await userDAO.getUserTypeByEmail(email);
        const user = await userDAO.getUserByEmail(email);

        if (type === 'admin') {
            res.render('menuadmin', { user });
        }

        if (type === 'securityhouse') {

            const tradingcontractsexpired = await tradingContractDAO.checkAndMoveExpiredContracts(user.idtype);
            const tradingcontracts = await tradingContractDAO.getContractsBySecurityHouseId(user.idtype);
            console.log(tradingcontracts);
            const historyContracts = await tradingContractDAO.getAllTradingContractsHistory()
            const data = {
                user: user,
                historyContracts: historyContracts,
                tradingcontracts: tradingcontracts
            }

            res.render('fithmodule', { data });
        }

        if (type === 'investor') {
            const stocks = await stockInvestorDAO.getAllStocksForInvestor(user.idtype);

            if (Array.isArray(stocks)) {
                const stockData = await Promise.all(stocks.map(async (stock) => {

                    const company = await stockDAO.getStockById(stock.stockId);
                    const companyName = company.name;
                    const companyHistoricalData = company.historicalData;
                    const totalValue = stock.quantity * stock.actualPrice;

                    return {
                        id: stock.id,
                        date: stock.date,
                        originalPrice: stock.originalPrice,
                        quantity: stock.quantity,
                        stockId: stock.stockId,
                        actualPrice: stock.actualPrice,
                        companyName: companyName,
                        companyHistoricalData: companyHistoricalData,
                        totalValue: totalValue 
                        
                    };
                }));

                // Calcular ganancias totales como la suma de los valores de cada acción
                const totalGains = stockData.reduce((sum, stock) => sum + stock.totalValue, 0);

                res.render('fourthmodule', { user, stocks: stockData, totalGains,  
              });
            } else {
                console.log("stocks no es un array.");
            }
        }


    } else {

    }


})


module.exports = router;