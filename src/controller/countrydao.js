const { db } = require('../firebase');
const CountryDTO = require('../model/countrydto');

class CountryDAO {
    constructor() {
        this.collection = db.collection('countries'); // Collection name in Firestore
    }

    // Create a new country with individual attributes as arguments
    async createCountry(countryName, cityName, economicSituation) {
        if (!countryName || !cityName || !economicSituation) {
            throw new Error('All fields are required');
        }

        const country = new CountryDTO({
            countryName,
            cityName,
            economicSituation
        });

        const docRef = await this.collection.add({ ...country });
        return { id: docRef.id, ...country };
    }

    // Get a country by ID
    async getCountryById(countryId) {
        const doc = await this.collection.doc(countryId).get();
        if (!doc.exists) {
            throw new Error(`Country with ID ${countryId} not found`);
        }
        return { id: doc.id, ...doc.data() };
    }

    // Get all countries
    async getAllCountries() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Update a country by ID with individual attributes as arguments
    async updateCountry(countryId, countryName, cityName, economicSituation) {
        const docRef = this.collection.doc(countryId);
        
        const updatedData = {
            countryName,
            cityName,
            economicSituation
        };

        await docRef.update(updatedData);
        return { id: countryId, ...updatedData };
    }

    // Delete a country by ID
    async deleteCountry(countryId) {
        await this.collection.doc(countryId).delete();
        return { message: `Country with ID ${countryId} deleted successfully` };
    }

    // Function to check if a country name is already in use
async isCountryNameInUse(countryName) {
    const snapshot = await this.collection.where('countryName', '==', countryName).get();
    return !snapshot.empty; // Returns true if a document with this country name exists
  }
  
  // Function to check if a city name is already in use
  async isCityNameInUse(cityName) {
    const snapshot = await this.collection.where('cityName', '==', cityName).get();
    return !snapshot.empty; // Returns true if a document with this city name exists
  }
}

module.exports = CountryDAO;
