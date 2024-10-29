// dao/StockDAO.js
const { db } = require('../firebase')
const StockDTO = require('../stockdto');

class StockDAO {
  constructor() {
    this.collection = db.collection('stocks');
  }

  // Create a new stock
  async createStock(stockDTO) {
    const docRef = await this.collection.add({
      name: stockDTO.name,
      description: stockDTO.description,
      date: stockDTO.date,
      value: stockDTO.value,
      company: stockDTO.company,
      amountSold: stockDTO.amountSold,
      inStorage: stockDTO.inStorage,
      historicalData: stockDTO.historicalData || [], // New historical data field
    });
    const doc = await docRef.get();
    return new StockDTO(
      doc.id,
      doc.data().name,
      doc.data().description,
      doc.data().date.toDate(),
      doc.data().value,
      doc.data().company,
      doc.data().amountSold,
      doc.data().inStorage,
      doc.data().historicalData
    );
  }

  // Get all stocks
  async getStocks() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(
      (doc) =>
        new StockDTO(
          doc.id,
          doc.data().name,
          doc.data().description,
          doc.data().date.toDate(),
          doc.data().value,
          doc.data().company,
          doc.data().amountSold,
          doc.data().inStorage,
          doc.data().historicalData
        )
    );
  }

  // Get a stock by ID
  async getStockById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists
      ? new StockDTO(
          doc.id,
          doc.data().name,
          doc.data().description,
          doc.data().date.toDate(),
          doc.data().value,
          doc.data().company,
          doc.data().amountSold,
          doc.data().inStorage,
          doc.data().historicalData
        )
      : null;
  }

  // Update a stock
  async updateStock(id, stockDTO) {
    await this.collection.doc(id).update({
      name: stockDTO.name,
      description: stockDTO.description,
      date: stockDTO.date,
      value: stockDTO.value,
      company: stockDTO.company,
      amountSold: stockDTO.amountSold,
      inStorage: stockDTO.inStorage,
      historicalData: stockDTO.historicalData,
    });
    const doc = await this.collection.doc(id).get();
    return new StockDTO(
      doc.id,
      doc.data().name,
      doc.data().description,
      doc.data().date.toDate(),
      doc.data().value,
      doc.data().company,
      doc.data().amountSold,
      doc.data().inStorage,
      doc.data().historicalData
    );
  }

  // Delete a stock
  async deleteStock(id) {
    await this.collection.doc(id).delete();
    return `Stock with ID ${id} deleted`;
  }
}

module.exports = StockDAO;
