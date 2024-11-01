// dao/StockInvestorDAO.js
const { db } = require('../firebase');
const StockInvestorDTO = require('../model/stockinvestordto');

class StockInvestorDAO {
    constructor() {
        this.investorsCollection = db.collection('investors'); // Main collection for investors
    }

    // Method to create a stock entry for an investor inside the 'stocks' subcollection
    async createStockForInvestor(investorId, quantity, originalPrice, actualPrice, stockId, date) {
        const stockData = new StockInvestorDTO({
            quantity,
            originalprice: originalPrice,
            actualprice: actualPrice,
            stockid: stockId,
            date
        });

        const investorDocRef = this.investorsCollection.doc(investorId); // Reference to the investor document
        const stockCollectionRef = investorDocRef.collection('stocks'); // Reference to the 'stocks' subcollection
        
        const docRef = await stockCollectionRef.add({ ...stockData });
        return { id: docRef.id, ...stockData };
    }

    // Method to get a stock by its ID within the 'stocks' subcollection of a specific investor
    async getStockById(investorId, stockId) {
        const stockDoc = await this.investorsCollection
            .doc(investorId)
            .collection('stocks')
            .doc(stockId)
            .get();
        
        if (!stockDoc.exists) {
            throw new Error(`Stock with ID ${stockId} not found for investor ${investorId}`);
        }

        return { id: stockDoc.id, ...stockDoc.data() };
    }

    // Method to get all stocks for a specific investor
    async getAllStocksForInvestor(investorId) {
        const snapshot = await this.investorsCollection
            .doc(investorId)
            .collection('stocks')
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Method to update a stock entry in the 'stocks' subcollection for an investor
    async updateStockForInvestor(investorId, stockId, quantity, originalPrice, actualPrice, stockId, date) {
        const stockData = {
            quantity,
            originalprice: originalPrice,
            actualprice: actualPrice,
            stockid: stockId,
            date
        };

        const stockDocRef = this.investorsCollection
            .doc(investorId)
            .collection('stocks')
            .doc(stockId);
        
        await stockDocRef.update(stockData);
        return { id: stockId, ...stockData };
    }

    // Method to delete a stock entry from the 'stocks' subcollection for an investor
    async deleteStockForInvestor(investorId, stockId) {
        await this.investorsCollection
            .doc(investorId)
            .collection('stocks')
            .doc(stockId)
            .delete();
        
        return { message: `Stock with ID ${stockId} for investor ${investorId} has been deleted.` };
    }
}

module.exports = StockInvestorDAO;
