const SecurityHouseDTO = require('./securityhousedto');
const InvestorDTO = require('./investordto');

// dto/TradingContractDTO.js
class TradingContractDTO {
  constructor(id, stock, expirationDate, terms, isAccepted,amount,type) {
    this.id = id; // Unique identifier for the trading contract
    this.stock = stock; // Stock associated with the contract
    this.expirationDate = expirationDate; // Expiration date of the contract
    this.terms = terms; // Terms of the contract
    this.isAccepted = isAccepted; // Boolean indicating if the contract is accepted
    this.amount = amount;
    this.type = type;
    this.securityhousedto = SecurityHouseDTO;
    this.investorDTO = InvestorDTO;
  }
}



module.exports = TradingContractDTO;
