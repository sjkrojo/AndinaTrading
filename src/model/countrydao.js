const { db } = require('../firebase');
const CountryDTO = require('./countrydto');

class CountryDAO {
    constructor() {
        this.collection = db.collection('countries'); // Nombre de la colección en Firestore
    }

    // Método para crear un nuevo país
    async createCountry(countryData) {
        const { countryName, cityName, economicSituation } = countryData;

        if (countryName && cityName && economicSituation) {
            const country = new CountryDTO({
                countryName,
                cityName,
                economicSituation,
                participatingCompanies
            });
            const docRef = await this.collection.add({ ...country });
            return { id: docRef.id, ...country };
        } else {
            throw new Error('All fields are required');
        }
    }

    // Método para obtener un país por ID
    async getCountryById(countryId) {
        const doc = await this.collection.doc(countryId).get();
        if (!doc.exists) {
            throw new Error(`Country with ID ${countryId} not found`);
        }
        return { id: doc.id, ...doc.data() };
    }

    // Método para obtener todos los países
    async getAllCountries() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Método para actualizar un país por ID
    async updateCountry(countryId, countryData) {
        const docRef = this.collection.doc(countryId);
        await docRef.update(countryData);
        return { id: countryId, ...countryData };
    }

    // Método para eliminar un país por ID
    async deleteCountry(countryId) {
        await this.collection.doc(countryId).delete();
        return { message: `Country with ID ${countryId} deleted successfully` };
    }
}

module.exports = CountryDAO;
