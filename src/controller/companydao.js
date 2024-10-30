// dao/CompanyDAO.js
const { db } = require('../firebase')
const CompanyDTO = require('../model/companydto');
const StockDTO = require('../model/stockdto');
const StockDAO = require('./stockdao');

class CompanyDAO {
  constructor() {
    this.collection = db.collection('companies');
    this.stockDAO = new StockDAO(); // Initialize StockDAO
  }

// Función para crear una nueva empresa con su stock asociado, recibiendo las variables como argumentos
async  createCompany(name, country, city, stock) {
  // Crear la empresa
  const docRef = await this.collection.add({
      name,
      country,
      city,
      stockId: stock.id, // Almacena el ID del stock en la empresa
  });

  return { id: docRef.id, name, country, city, stockId: stock.id };
}
  // Get all companies with their stock data
  async getCompanies() {
    const snapshot = await this.collection.get();
    const companies = await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const stock = await this.stockDAO.getStockById(data.stockId);
      return new CompanyDTO(doc.id, data.name, data.country, data.city, stock);
    }));
    return companies;
  }

  // Get a company by ID with its stock data
  async getCompanyById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    const stock = await this.stockDAO.getStockById(data.stockId);
    return new CompanyDTO(doc.id, data.name, data.country, data.city, stock);
  }

  // Update a company and its stock
  async updateCompany(id, updatedData) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    // Update company data
    await this.collection.doc(id).update(updatedData);

    const data = doc.data();
    const stockId = data.stockId;

    // Update stock data if provided
    if (updatedData.stock) {
      await this.stockDAO.updateStock(stockId, updatedData.stock);
    }

    // Fetch updated data
    const updatedDoc = await this.collection.doc(id).get();
    const updatedStock = await this.stockDAO.getStockById(stockId);
    return new CompanyDTO(updatedDoc.id, updatedDoc.data().name, updatedDoc.data().country, updatedDoc.data().city, updatedStock);
  }

  // Delete a company and its associated stock
  async deleteCompany(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return `Company with ID ${id} does not exist.`;

    const data = doc.data();
    await this.stockDAO.deleteStock(data.stockId); // Delete associated stock
    await this.collection.doc(id).delete(); // Delete company
    return `Company with ID ${id} has been deleted.`;
  }
}

module.exports = CompanyDAO;
