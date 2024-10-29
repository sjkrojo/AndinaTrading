const { db } = require('../firebase.js');
const CountryDTO = require('./countryDTO.js');

class CountryDAO {
    constructor() {
        this.collection = db.collection('countries'); // Firestore collection name
    }

    // Method to create a new country
    async createCountry(countryData) {
        const { countryName, cityName, economicSituation } = countryData;

        if (countryName && cityName && economicSituation) {
            const country = new CountryDTO({ ...countryData });
            const docRef = await this.collection.add({ ...country });
            return { id: docRef.id, ...country };
        } else {
            throw new Error('All fields are required');
        }
    }

    // Method to get a country by ID
    async getCountryById(countryId) {
        if (!countryId) {
            throw new Error('Country ID is required');
        }

        const doc = await this.collection.doc(countryId).get();
        if (!doc.exists) {
            throw new Error(`Country with ID ${countryId} not found`);
        }
        return { id: doc.id, ...doc.data() };
    }

    // Method to get all countries
    async getAllCountries() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Method to update a country by ID
    async updateCountry(countryId, countryData) {
        if (!countryId) {
            throw new Error('Country ID is required');
        }

        const { countryName, cityName, economicSituation } = countryData;

        if (countryName && cityName && economicSituation) {
            const docRef = this.collection.doc(countryId);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error(`Country with ID ${countryId} not found`);
            }

            await docRef.update(countryData);
            return { id: countryId, ...countryData };
        } else {
            throw new Error('All fields are required');
        }
    }

    // Method to delete a country by ID
    async deleteCountry(countryId) {
        if (!countryId) {
            throw new Error('Country ID is required');
        }

        const docRef = this.collection.doc(countryId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error(`Country with ID ${countryId} not found`);
        }

        await docRef.delete();
        return { message: `Country with ID ${countryId} deleted successfully` };
    }
}

module.exports = CountryDAO;
