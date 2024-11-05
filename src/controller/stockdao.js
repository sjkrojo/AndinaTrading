// dao/StockDAO.js
const { db } = require('../firebase')
const StockDTO = require('../model/stockdto');

class StockDAO {
  constructor() {
    this.collection = db.collection('stocks');
  }

// Método para crear una entrada de stock para un inversor dentro de la subcolección 'stocks'
async createStockForInvestor(investorId, quantity, originalPrice, actualPrice, stockId, date) {
  const stockData = new StockInvestorDTO({
      quantity,
      originalprice: originalPrice,
      actualprice: actualPrice,
      stockid: stockId,
      date
  });

  // Verifica que stockData tenga todos los campos necesarios y sin valores undefined
  if (!stockData.quantity || !stockData.originalprice || !stockData.actualprice || !stockData.stockid || !stockData.date) {
      throw new Error("Stock data contiene valores undefined o faltantes.");
  }

  const investorDocRef = this.investorsCollection.doc(investorId); // Referencia al documento del inversor
  const stockCollectionRef = investorDocRef.collection('stocks'); // Referencia a la subcolección 'stocks'
  
  const docRef = await stockCollectionRef.add({ ...stockData });
  return { id: docRef.id, ...stockData };
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
      ? {
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          date: doc.data().date.toDate(), // Asegúrate de que date sea un objeto Date o lo que necesites
          value: doc.data().value,
          company: doc.data().company,
          amountSold: doc.data().amountSold,
          inStorage: doc.data().inStorage,
          historicalData: doc.data().historicalData
      }
      : null;
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
  const data = doc.data();
  
  return new StockDTO(
      doc.id,
      data.name,
      data.description,
      data.date.toDate(),
      data.value,
      data.company,
      data.amountSold,
      data.inStorage,
      data.historicalData
  );
}

 // Update a stock with individual values as parameters
 async updateStock(id, name, description, date, value, company, inStorage ) {
  await this.collection.doc(id).update({
    name,
    description,
    date: new Date(date),
    value: parseFloat(value),
    company,
    inStorage: parseInt(inStorage)
  });

  const doc = await this.collection.doc(id).get();
  return new StockDTO(
    doc.id,
    doc.data().name,
    doc.data().description,
    doc.data().date.toDate(),
    doc.data().value,
    doc.data().company,
    doc.data().inStorage
  );
}

  // Delete a stock
  async deleteStock(id) {
    await this.collection.doc(id).delete();
    return `Stock with ID ${id} deleted`;
  }
}



module.exports = StockDAO;
