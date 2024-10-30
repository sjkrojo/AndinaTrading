// dao/TradingContractDAO.js
const { db } = require('../firebase')
const TradingContractDTO = require('../model/tradingcontractdto');

class TradingContractDAO {
  constructor() {
    this.collection = db.collection('tradingContracts');
  }

  // Create a new trading contract
  async createTradingContract(tradingContractDTO) {
    const docRef = await this.collection.add({
      stock: tradingContractDTO.stock,
      expirationDate: tradingContractDTO.expirationDate,
      terms: tradingContractDTO.terms,
      isAccepted: tradingContractDTO.isAccepted // Store acceptance status
    });
    return { id: docRef.id, ...tradingContractDTO };
  }

  // Get all trading contracts
  async getTradingContracts() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => new TradingContractDTO(
      doc.id,
      doc.data().stock,
      doc.data().expirationDate,
      doc.data().terms,
      doc.data().isAccepted // Include acceptance status
    ));
  }

  // Get trading contract by ID
  async getTradingContractById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return new TradingContractDTO(doc.id, data.stock, data.expirationDate, data.terms, data.isAccepted);
  }

  // Update a trading contract
  async updateTradingContract(id, updatedData) {
    await this.collection.doc(id).update(updatedData);
    const doc = await this.collection.doc(id).get();
    return new TradingContractDTO(doc.id, doc.data().stock, doc.data().expirationDate, doc.data().terms, doc.data().isAccepted);
  }

  // Delete a trading contract
  async deleteTradingContract(id) {
    await this.collection.doc(id).delete();
    return `Trading contract with ID ${id} has been deleted.`;
  }
}

module.exports = TradingContractDAO;
