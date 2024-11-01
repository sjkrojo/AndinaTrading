// dao/SecurityHouseDAO.js
const { db } = require('../firebase')
const SecurityHouseDTO = require('../model/securityhousedto');
const TradingContractDAO = require('./tradingcontractdao');

class SecurityHouseDAO {
  constructor() {
    this.collection = db.collection('securityHouses');
    this.tradingContractDAO = new TradingContractDAO(); // Instantiate TradingContractDAO
  }

  // Create a new security house
  async createSecurityHouse(name, city, country) {
    const docRef = await this.collection.add({
      name: name,
      location: { city: city, country: country }
    });
    return {
      id: docRef.id,
      name: name,
      location: { city: city, country: country }
    };
  }

  // Check if a security house name is already in use
async isNameInUse(name) {
  const querySnapshot = await this.collection.where('name', '==', name).get();
  return !querySnapshot.empty; // Returns true if name is found, otherwise false
}

  // Get all security houses
  async getSecurityHouses() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => new SecurityHouseDTO(
      doc.id,
      doc.data().name,
      doc.data().location.city,
      doc.data().location.country
    ));
  }

  // Get security house by ID
  async getSecurityHouseById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };

  }

  // Update a security house
  async updateSecurityHouse(id, name, city, country) {
    const updatedData = {
      name: name,
      location: { city: city, country: country }
    };
    await this.collection.doc(id).update(updatedData);
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() };

  }

  // Delete a security house
  async deleteSecurityHouse(id) {
    await this.collection.doc(id).delete();
    return `Security house with ID ${id} has been deleted.`;
  }
}

module.exports = SecurityHouseDAO;
