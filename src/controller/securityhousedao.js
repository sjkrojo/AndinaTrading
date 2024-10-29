// dao/SecurityHouseDAO.js
const { db } = require('../firebase')
const SecurityHouseDTO = require('../securityHousedto');
const TradingContractDAO = require('./tradingcontractdao');

class SecurityHouseDAO {
  constructor() {
    this.collection = db.collection('securityHouses');
    this.tradingContractDAO = new TradingContractDAO(); // Instantiate TradingContractDAO
  }

  // Create a new security house
  async createSecurityHouse(securityHouseDTO) {
    const docRef = await this.collection.add({
      name: securityHouseDTO.name,
      location: securityHouseDTO.location,
      stocks: securityHouseDTO.stocks,
      tradingContracts: securityHouseDTO.tradingContracts, // Storing trading contract IDs
    });
    return { id: docRef.id, ...securityHouseDTO };
  }

  // Get all security houses
  async getSecurityHouses() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => new SecurityHouseDTO(
      doc.id,
      doc.data().name,
      doc.data().location.city,
      doc.data().location.country,
      doc.data().stocks,
      doc.data().tradingContracts // Assuming these are IDs or DTOs
    ));
  }

  // Get security house by ID
  async getSecurityHouseById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    const tradingContracts = await Promise.all(data.tradingContracts.map(async contractId => 
      this.tradingContractDAO.getTradingContractById(contractId)
    ));

    return new SecurityHouseDTO(
      doc.id,
      data.name,
      data.location.city,
      data.location.country,
      data.stocks,
      tradingContracts
    );
  }

  // Update a security house
  async updateSecurityHouse(id, updatedData) {
    await this.collection.doc(id).update(updatedData);
    const doc = await this.collection.doc(id).get();
    return new SecurityHouseDTO(
      doc.id,
      doc.data().name,
      doc.data().location.city,
      doc.data().location.country,
      doc.data().stocks,
      doc.data().tradingContracts // Assuming these are IDs or DTOs
    );
  }

  // Delete a security house
  async deleteSecurityHouse(id) {
    await this.collection.doc(id).delete();
    return `Security house with ID ${id} has been deleted.`;
  }
}

module.exports = SecurityHouseDAO;
