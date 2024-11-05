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

// Función para aumentar la cantidad de stocks en almacenamiento y reducir los stocks vendidos
async increaseStockQuantity(companyId, amount) {
  // Obtener el documento de la compañía por ID
  const doc = await this.collection.doc(companyId).get();
  if (!doc.exists) {
    throw new Error(`Company with ID ${companyId} does not exist.`);
  }

  const data = doc.data();
  const stockId = data.stockId;

  // Obtener el stock actual asociado con la empresa
  const stock = await this.stockDAO.getStockById(stockId);
  if (!stock) {
    throw new Error(`Stock with ID ${stockId} does not exist.`);
  }

  // Verificar que haya suficientes stocks vendidos para reducir la cantidad deseada
  if ((stock.soldStocks || 0) < amount) {
    throw new Error(`Insufficient sold stocks. Available: ${stock.soldStocks || 0}`);
  }

  // Actualizar el stock en almacenamiento y el stock vendido
  const newStockInStorage = stock.stockInStorage + amount;
  const newSoldStocks = stock.soldStocks - amount;

  // Actualizar el stock con los nuevos valores
  await this.stockDAO.updateStock(
    stockId,
    stock.name,
    stock.description,
    stock.date,
    stock.value,
    stock.company,
    newStockInStorage,
    newSoldStocks
  );

  return {
    message: `Stock increased successfully.`,
    stockInStorage: newStockInStorage,
    soldStocks: newSoldStocks
  };
}



// Función para actualizar la cantidad de stocks en inventario y vendidos
async updateStockQuantity(companyId, amount) {
  // Obtener el documento de la compañía por ID
  const doc = await this.collection.doc(companyId).get();
  if (!doc.exists) {
    throw new Error(`Company with ID ${companyId} does not exist.`);
  }

  const data = doc.data();
  const stockId = data.stockId;

  // Obtener el stock actual asociado con la empresa
  const stock = await this.stockDAO.getStockById(stockId);
  if (!stock) {
    throw new Error(`Stock with ID ${stockId} does not exist.`);
  }

  // Verificar que haya suficientes stocks en almacenamiento para restar la cantidad deseada
  if (stock.stockInStorage < amount) {
    throw new Error(`Insufficient stock in storage. Available: ${stock.stockInStorage}`);
  }

  // Actualizar el stock en almacenamiento y el stock vendido
  const newStockInStorage = stock.stockInStorage - amount;
  const newSoldStocks = (stock.soldStocks || 0) + amount; // Inicializar soldStocks en 0 si no existe

  // Actualizar el stock con los nuevos valores
  await this.stockDAO.updateStock(
    stockId,
    stock.name,
    stock.description,
    stock.date,
    stock.value,
    stock.company,
    newStockInStorage,
    newSoldStocks
  );

  return {
    message: `Stock updated successfully.`,
    stockInStorage: newStockInStorage,
    soldStocks: newSoldStocks
  };
}


 // Function to get all companies in a specified city and country
async getCompaniesByLocation(country, city) {
  const snapshot = await this.collection
    .where('country', '==', country)
    .where('city', '==', city)
    .get();

  if (snapshot.empty) return []; // Return an empty array if no companies found

  // Retrieve companies and their associated stock data
  const companies = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const stock = await this.stockDAO.getStockById(data.stockId);
      return new CompanyDTO(doc.id, data.name, data.country, data.city, stock);
    })
  );

  return companies;
}
 

  // Function to get a company by its name
async getCompanyByName(name) {
  const snapshot = await this.collection.where('name', '==', name).get();
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0]; // Assuming names are unique, we take the first match
  const data = doc.data();
  const stockId = data.stockId;

  // If the company has an associated stock, retrieve it
  const stock = stockId ? await this.stockDAO.getStockById(stockId) : null;

  return new CompanyDTO(
      doc.id,
      data.country,
      data.city,
      stock
  );
}

  // Get a company by ID with its stock data
  async getCompanyById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();
    const stock = await this.stockDAO.getStockById(data.stockId);
    return new CompanyDTO(doc.id, data.name, data.country, data.city, stock);
  }

// Update a company and its stock with individual parameters
async updateCompany(id, name, country, city, stockId, stockName, stockDescription, stockDate, stockValue, stockCompany, stockInStorage) {
  const doc = await this.collection.doc(id).get();
  if (!doc.exists) return null;

  // Update company data with individual parameters
  await this.collection.doc(id).update({
      name,
      country,
      city
  });

  // Update stock data if stockId and stock fields are provided
  if (stockId) {
      await this.stockDAO.updateStock(
          stockId,
          stockName,
          stockDescription,
          stockDate,
          stockValue,
          stockCompany,
          stockInStorage
      );
  }

  // Fetch updated company and stock data
  const updatedDoc = await this.collection.doc(id).get();
  const updatedStock = await this.stockDAO.getStockById(stockId);

  return new CompanyDTO(
      updatedDoc.id,
      updatedDoc.data().name,
      updatedDoc.data().country,
      updatedDoc.data().city,
      updatedStock
  );
}

// Function to check if a company name is already in use
async isCompanyNameInUse(name) {
  const snapshot = await this.collection.where('name', '==', name).get();
  return !snapshot.empty; // Returns true if a document with this name exists
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
