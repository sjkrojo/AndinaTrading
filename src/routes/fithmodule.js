const { Router } = require('express');
const CountryDAO = require('../controller/countrydao');
const CompanyDAO = require('../controller/companydao');
const StockDAO = require('../controller/stockdao');
const TradingContractDAO = require('../controller/tradingcontractdao');
const SecurityHouseDAO = require('../controller/securityhousedao');
const UserDAO = require('../controller/userdao'); 
const InvestorDAO = require('../controller/investordao'); 
const StockInvestorDAO = require('../controller/stockinvestordao'); 
const LogsDAO = require('../controller/logdao');
const logsdao = new LogsDAO();
const router = Router();

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
    const historyContracts = await tradingContractDAO.getAllTradingContractsHistory();
    const selectedstock = await stockDAO.getStockById(selectedContract.stock);
    const selecteduser = await investorDAO.getInvestorById(selectedContract.investorDTO.id);
    const data = {
        user: user,
        selectedContract: selectedContract,
        historyContracts: historyContracts,
        selectedstock: selectedstock,
        selecteduser: selecteduser,
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
    const historyContracts = await tradingContractDAO.getAllTradingContractsHistory();
    const selectedstock = await stockDAO.getStockById(historyContract.stock);
    const selecteduser = await investorDAO.getInvestorById(historyContract.investorDTO.id);
    const data = {
        user: user,
        historyContract: historyContract,
        historyContracts: historyContracts,
        selectedstock: selectedstock,
        selecteduser: selecteduser,
        tradingcontracts: tradingcontracts
    }
    res.render('fithmodule', { data })
})



router.post('/confirm/:id', async (req, res) => {

    const user = req.params;
    const {investorid,stockid, amount,contractId, action, type } = req.body;

    const stockactual = await stockDAO.getStockById(stockid);
    const company = await companyDAO.getCompanyByName(stockactual.company);
    const usersecu = await userDAO.getUserById(user.id);

    if(action === 'accept'){

    money_total = amount *stockactual.value;
    money_security = money_total * 0.1;
    money_total = money_total -money_security;
    console.log(type);
    if (type === 'Comprar'){
        const update = await companyDAO.updateStockQuantity(company.id , amount);
        const updateInvestor = await investorDAO.decrementInvestmentCapacity(investorid, money_total );    
        const createstockinvestor = await stockinvestorDAO.createStockForInvestor(investorid,amount, stockactual.value, stockactual.value, stockid, new Date());
        console.log("Trato de compra");
    }else{
        const deletestockinvestor = await stockinvestorDAO.deleteStockForInvestor(investorid,stockid);
        const update = await companyDAO.increaseStockQuantity(company.id , amount);
        const updateInvestor = await investorDAO.incrementInvestmentCapacity(investorid, money_total );    
        console.log("Trato de Venta");
    }
    const updateearnings = securityhouse.updateEarnings(usersecu.idtype,money_security);
    
    const updatecontracts = await tradingContractDAO.updateAndMoveTradingContract(contractId, true);
    }else{
        const updatecontracts = await tradingContractDAO.updateAndMoveTradingContract(contractId, false);
    }
    const historyContracts = await tradingContractDAO.getAllTradingContractsHistory();
    const tradingcontracts = await tradingContractDAO.getContractsBySecurityHouseId(usersecu.idtype);
    const data = {
        user: user,
        historyContracts: historyContracts,
        tradingcontracts: tradingcontracts
    }
    logsdao.createLog("CONFIRM", "Confirmación de acción en contrato con ID " + contractId, new Date(), "La acción '" + action + "' fue realizada en el contrato con ID " + contractId + " para el usuario con ID " + user.id + " con tipo de transacción '" + type + "' y cantidad " + amount);
    res.render('fithmodule', { data })
})

module.exports = router;