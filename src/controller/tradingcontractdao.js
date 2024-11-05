// dao/TradingContractDAO.js
const { db } = require('../firebase')
const TradingContractDTO = require('../model/tradingcontractdto');

class TradingContractDAO {
  constructor() {
    this.collection = db.collection('tradingcontracts');
  }

  // Create a new trading contract
  async createTradingContract(stock, expirationDate, terms, isAccepted,amount,type, securityHouseDTO, investorDTO) {
    const docRef = await this.collection.add({
      stock,
      expirationDate: new Date(expirationDate), // Convert to Date object
      terms,
      isAccepted,
      amount,
      type,
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
      doc.data().amount,
      doc.data().type,
      doc.data().securityHouseDTO,
      doc.data().investorDTO
    );
  }

  // Update an existing trading contract
  async updateTradingContract(id, stock, expirationDate, terms, isAccepted, amount,type,securityHouseDTO, investorDTO) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    // Update contract data
    await this.collection.doc(id).update({
      stock,
      expirationDate: new Date(expirationDate),
      terms,
      isAccepted,
      amount,
      type,
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
      updatedDoc.data().amount,
      updatedDoc.data().type,
      updatedDoc.data().securityHouseDTO,
      updatedDoc.data().investorDTO
    );
  }
// Get a trading contract by ID
async getTradingContractById(id) {
  const doc = await this.collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data(), expirationDate: doc.data().expirationDate.toDate() };
}

  
  // Delete a trading contract by ID
  async deleteTradingContractById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null; // Return null if the document does not exist

    await this.collection.doc(id).delete();
    return `Trading contract with ID ${id} deleted`;
  }

    // Get all trading contracts by security house ID
    async getContractsBySecurityHouseId(securityHouseId) {
      const snapshot = await this.collection.where('securityHouseDTO.id', '==', securityHouseId).get();
      if (snapshot.empty) return []; // Return empty array if no contracts found

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateAndMoveTradingContract(contractId, isAccepted) {
    try {
        // Reference to the contract in the 'tradingcontracts' collection
        const contractRef = this.collection.doc(contractId);
        const contractSnapshot = await contractRef.get();

        // Check if the contract exists
        if (!contractSnapshot.exists) {
            throw new Error(`Trading contract with ID ${contractId} does not exist.`);
        }

        // Update the 'isAccepted' field
        await contractRef.update({ isAccepted });

        // Get contract data for history
        const tradingContractData = contractSnapshot.data();
        tradingContractData.isAccepted = isAccepted;
        tradingContractData.updatedAt = new Date(); // Use current date for updatedAt

        // Save the contract in the 'tradingcontractshistory' collection
        await db.collection('tradingcontractshistory').doc(contractId).set(tradingContractData);

        // Delete the contract from the 'tradingcontracts' collection
        await contractRef.delete();

        console.log(`Trading contract ${contractId} updated, moved to history, and deleted from tradingcontracts.`);
    } catch (error) {
        console.error("Error updating and moving trading contract:", error);
    }
}

// Get all trading contracts filtered by investor's risk profile and security house location
async getTradingContractsByRiskProfileAndLocation(riskProfile, location) {
  try {
    const snapshot = await this.collection
      .where('investorDTO.riskProfile', '==', riskProfile)
      .where('securityHouseDTO.location', '==', location)
      .get();

    if (snapshot.empty) {
      console.log('No trading contracts found with the specified filters.');
      return []; // Return empty array if no contracts found
    }


      // Map the results to an array of contract data
      const contracts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expirationDate: doc.data().expirationDate.toDate() // Convert Firestore timestamp to JavaScript Date if necessary
    }));

    // Return the filtered contracts
    return contracts;
  } catch (error) {
    console.error("Error retrieving trading contracts:", error);
    throw error; // Re-throw the error for further handling if necessary
  }
}



// Assuming this function is part of the TradingContractDAO class
async checkAndMoveExpiredContracts(securityHouseId) {
  try {
      // Fetch all trading contracts associated with the given security house ID
      const snapshot = await this.collection.where('securityHouseDTO.id', '==', securityHouseId).get();

      if (snapshot.empty) {
          console.log(`No trading contracts found for security house ID ${securityHouseId}.`);
          return;
      }

      // Get the current date for comparison
      const currentDate = new Date();

      // Iterate through each trading contract
      for (const doc of snapshot.docs) {
          const contractData = doc.data();
          const expirationDate = contractData.expirationDate.toDate(); // Convert Firestore timestamp to JavaScript Date
          
          // Check if the expiration date has passed
          if (expirationDate < currentDate) {
              const contractId = doc.id; // Get the document ID for the trading contract

              // Call updateAndMoveTradingContract to handle the expired contract
              await this.updateAndMoveTradingContract(contractId, false); // Assuming `isAccepted` is false for expired contracts
              console.log(`Trading contract ${contractId} has expired and has been moved to history.`);
          }
      }
  } catch (error) {
      console.error("Error checking and moving expired contracts:", error);
  }
}

// Get a trading contract from tradingcontractshistory by ID
async getTradingContractHistoryById(contractId) {
  try {
      const doc = await db.collection('tradingcontractshistory').doc(contractId).get();
      
      if (!doc.exists) {
          console.log(`No trading contract found in history with ID ${contractId}.`);
          return null; // Return null if the document does not exist
      }

      // Return the document data, converting dates if they exist
      return {
          id: doc.id,
          ...doc.data(),
          expirationDate: doc.data().expirationDate ? doc.data().expirationDate.toDate() : null, // Convert to Date if it exists
          updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : null // Convert to Date if it exists
      };
  } catch (error) {
      console.error(`Error retrieving trading contract history with ID ${contractId}:`, error);
      throw error; // Re-throw the error for further handling if necessary
  }
}


// Get all trading contracts from tradingcontractshistory
async getAllTradingContractsHistory() {
  try {
      const snapshot = await db.collection('tradingcontractshistory').get();
      
      if (snapshot.empty) {
          console.log('No trading contracts found in history.');
          return []; // Return an empty array if no documents are found
      }

      // Map the documents to an array of objects
      const tradingContractsHistory = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          expirationDate: doc.data().expirationDate ? doc.data().expirationDate.toDate() : null, // Convert to Date if it exists
          updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : null // Convert to Date if it exists
      }));

      return tradingContractsHistory;
  } catch (error) {
      console.error("Error retrieving trading contracts history:", error);
      throw error; // Re-throw the error for further handling if necessary
  }
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
