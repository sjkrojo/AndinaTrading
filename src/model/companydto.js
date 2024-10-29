// dto/CompanyDTO.js
const StockDTO = require('./stockdto');

class CompanyDTO {
  constructor(id, name, country, city, stockDTO = null) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.city = city;
    this.stockDTO = stockDTO; // Reference to associated StockDTO instance
  }
}

module.exports = CompanyDTO;
