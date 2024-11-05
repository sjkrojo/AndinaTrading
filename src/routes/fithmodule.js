const { Router } = require('express');
const CountryDAO = require('../controller/countrydao');
const CompanyDAO = require('../controller/companydao');
const StockDAO = require('../controller/stockdao');
const TradingContractDAO = require('../controller/tradingcontractdao');
const SecurityHouseDAO = require('../controller/securityhousedao');
const UserDAO = require('../controller/userdao'); 
const InvestorDAO = require('../controller/investordao'); 
const StockInvestorDAO = require('../controller/stockinvestordao'); 

const router = Router();
const countryDAO = new CountryDAO();
const companyDAO = new CompanyDAO();
const stockDAO = new StockDAO();
const tradingContractDAO = new TradingContractDAO();
const securityhouse = new SecurityHouseDAO();
const userDAO = new UserDAO();
const investorDAO = new InvestorDAO();
const stockinvestorDAO = new StockInvestorDAO();

router.post('/select/:id', async (req, res) => {

    const user = req.params;
    const {contract} = req.body;

    const usersecu = await userDAO.getUserById(user.id);
    const tradingcontracts = await tradingContractDAO.getContractsBySecurityHouseId(usersecu.idtype);
    const selectedContract = await tradingContractDAO.getTradingContractById(contract);

    const data = {
        user: user,
        selectedContract: selectedContract,
        tradingcontracts: tradingcontracts
    }
    res.render('fithmodule', { data })
})



router.post('/selecthistory/:id', async (req, res) => {

    const user = req.params;
    const {historycon} = req.body;

    const usersecu = await userDAO.getUserById(user.id);
    const tradingcontracts = await tradingContractDAO.getContractsBySecurityHouseId(usersecu.idtype);
    const historyContract = await tradingContractDAO.getTradingContractHistoryById(historycon);

    const data = {
        user: user,
        historyContract: historyContract,
        tradingcontracts: tradingcontracts
    }
    res.render('fithmodule', { data })
})



router.post('/confirm/:id', async (req, res) => {

    const user = req.params;
    const {investorid,stockid, amount,contractId, action, type } = req.body;

    const stockactual = await stockDAO.getStockById(stockid);

    const usersecu = await userDAO.getUserById(user.id);

    if(action === 'accept'){
    
    console.log(investorid);
    console.log(amount);
    console.log(stockactual.value);
    console.log(stockid);updateStockQuantity
    money_total = amount *stockactual.value;
    money_security = money_total * 0.1;
    money_total = money_total -money_security;
    if (type == 'Compra'){
        const update = await companyDAO.updateStockQuantity(stockactual.company , amount);
        const updateInvestor = await investorDAO.decrementInvestmentCapacity(investorid, money_total );    
        const createstockinvestor = await stockinvestorDAO.createStockForInvestor(investorid,amount, stockactual.value, stockactual.value, stockid, new Date());
   
    }else{
        const deletestockinvestor = await stockinvestorDAO.deleteStockForInvestor(investorid,stockid);
        const update = await companyDAO.increaseStockQuantity(stockactual.company , amount);
        const updateInvestor = await investorDAO.increaseStockQuantity(investorid, money_total );    
    }
    const updateearnings = securityhouse.updateEarnings(usersecu.idtype,money_security);
    
    const updatecontracts = await tradingContractDAO.updateAndMoveTradingContract(contractId, true);
    }else{
        const updatecontracts = await tradingContractDAO.updateAndMoveTradingContract(contractId, false);
    }

    const tradingcontracts = await tradingContractDAO.getContractsBySecurityHouseId(usersecu.idtype);
    const data = {
        user: user,
        tradingcontracts: tradingcontracts
    }

    res.render('fithmodule', { data })
})

module.exports = router;