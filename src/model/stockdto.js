// dto/StockDTO.js
class StockDTO {
    constructor(id, name, description, date, value, company, amountSold, inStorage, historicalData) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.date = date;
      this.value = value;
      this.company = company;
      this.amountSold = amountSold;
      this.inStorage = inStorage;
      this.historicalData = historicalData; // Array representing historical data of last five days
    }
  }
  
  module.exports = StockDTO;
  