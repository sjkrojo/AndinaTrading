// dto/SecurityHouseDTO.js
class SecurityHouseDTO {
    constructor(id, name, location, tradingContracts) {
      this.id = id; // Unique identifier for the security house
      this.name = name; // Name of the security house
      this.location = location; // Location as an object with city and country
      this.tradingContracts = tradingContracts; // List of trading contracts
      this.earnings = 0; // Gains
    }
  }
  
  module.exports = SecurityHouseDTO;
  