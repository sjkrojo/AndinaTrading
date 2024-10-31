// dao/TradingContractDAO.js
const { db } = require('../firebase')
const TradingContractDTO = require('../model/tradingcontractdto');

class TradingContractDAO {
  constructor() {
    this.collection = db.collection('tradingcontracts');
  }

  // Create a new trading contract
  async createTradingContract(stock, expirationDate, terms, isAccepted, securityHouseDTO, investorDTO) {
    const docRef = await this.collection.add({
      stock,
      expirationDate: new Date(expirationDate), // Convert to Date object
      terms,
      isAccepted,
      securityHouseDTO,
      investorDTO,
    });

    const doc = await docRef.get();
    return new TradingContractDTO(
      doc.id,
      doc.data().stock,
      doc.data().expirationDate.toDate(),
      doc.data().terms,
      doc.data().isAccepted,
      doc.data().securityHouseDTO,
      doc.data().investorDTO
    );
  }

  // Update an existing trading contract
  async updateTradingContract(id, stock, expirationDate, terms, isAccepted, securityHouseDTO, investorDTO) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    // Update contract data
    await this.collection.doc(id).update({
      stock,
      expirationDate: new Date(expirationDate),
      terms,
      isAccepted,
      securityHouseDTO,
      investorDTO,
    });

    // Fetch updated data
    const updatedDoc = await this.collection.doc(id).get();
    return new TradingContractDTO(
      updatedDoc.id,
      updatedDoc.data().stock,
      updatedDoc.data().expirationDate.toDate(),
      updatedDoc.data().terms,
      updatedDoc.data().isAccepted,
      updatedDoc.data().securityHouseDTO,
      updatedDoc.data().investorDTO
    );
  }


  // Get a trading contract by ID
  async getTradingContractById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists
      ? new TradingContractDTO(
          doc.id,
          doc.data().stock,
          doc.data().expirationDate.toDate(),
          doc.data().terms,
          doc.data().isAccepted,
          doc.data().securityHouseDTO,
          doc.data().investorDTO
        )
      : null;
  }

  // Delete a trading contract by ID
  async deleteTradingContractById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null; // Return null if the document does not exist

    await this.collection.doc(id).delete();
    return `Trading contract with ID ${id} deleted`;
  }

    // Check if the expiration date has passed
    async hasExpirationDatePassed(id) {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null; // Return null if the document does not exist
  
      const expirationDate = doc.data().expirationDate.toDate(); // Convert Firestore timestamp to JavaScript Date
      const currentDate = new Date(); // Get the current date
  
      return expirationDate < currentDate; // Return true if the expiration date has passed, otherwise false
    }

  // Additional methods can be added as needed, such as get, delete, etc.
}

module.exports = TradingContractDAO;
