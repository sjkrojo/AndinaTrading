// dao/StockDAO.js
const { db } = require('../firebase');
const StockDTO = require('../model/stockdto');

class StockDAO {
  constructor() {
    this.collection = db.collection('stocks');
  }

  // Function to create a new stock with variables as arguments
  async createStock(name, description, date, value, company, amountSold, inStorage) {
    const historicalData = [];

    const docRef = await this.collection.add({
      name,
      description,
      date: new Date(date),
      value: parseFloat(value),
      company,
      amountSold: parseInt(amountSold),
      inStorage: parseInt(inStorage),
      historicalData,
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

// Function to check if a stock name is already in use
async isStockNameInUse(name) {
  const snapshot = await this.collection.where('name', '==', name).get();
  return !snapshot.empty; // Returns true if a document with this name exists
}


// Function to get a stock by its name
async getStockByName(name) {
  const snapshot = await this.collection.where('name', '==', name).get();
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0]; // Assuming names are unique, we take the first match
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

  // Update a stock with individual values as parameters
  async updateStock(id, name, description, date, value, company, amountSold, inStorage, historicalData) {
    await this.collection.doc(id).update({
      name,
      description,
      date: new Date(date),
      value: parseFloat(value),
      company,
      amountSold: parseInt(amountSold),
      inStorage: parseInt(inStorage),
      historicalData,
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
