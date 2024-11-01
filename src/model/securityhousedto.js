// dto/SecurityHouseDTO.js
class SecurityHouseDTO {
    constructor(id, name, city, country, stocks, tradingContracts) {
      this.id = id; // Unique identifier for the security house
      this.name = name; // Name of the security house
      this.location = { city, country }; // Location as an object with city and country
      this.tradingContracts = tradingContracts; // List of trading contracts
      this.earnings = earnings; // Name of the security house
    }
  }
  
  module.exports = SecurityHouseDTO;
  