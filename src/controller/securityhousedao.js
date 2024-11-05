// dao/SecurityHouseDAO.js
const { db } = require('../firebase');
const SecurityHouseDTO = require('../model/securityhousedto');
const TradingContractDAO = require('./tradingcontractdao');

class SecurityHouseDAO {
  constructor() {
    this.collection = db.collection('securityHouses');
    this.tradingContractDAO = new TradingContractDAO(); // Instanciar TradingContractDAO
  }

  // Crear una nueva security house
  async createSecurityHouse(name, location) {
    const docRef = await this.collection.add({
      name: name,
      location: location, // location debe ser un objeto que contenga city y country
      earnings: 0 // Inicializar earnings en 0
    });
    return new SecurityHouseDTO(docRef.id, name, location, []); // Retornar un DTO
  }

  // Comprobar si un nombre de security house ya está en uso
  async isNameInUse(name) {
    const querySnapshot = await this.collection.where('name', '==', name).get();
    return !querySnapshot.empty; // Retorna true si se encuentra el nombre, de lo contrario false
  }

  // Función para actualizar el atributo earnings sumando un amount especificado
  async updateEarnings(id, amount) {
    // Obtener el documento de la security house por ID
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new Error(`Security house with ID ${id} does not exist.`);
    }

    // Obtener el valor actual de earnings
    const currentData = doc.data();
    const currentEarnings = currentData.earnings || 0; // Si earnings no existe, se asume 0

    // Calcular el nuevo valor de earnings
    const newEarnings = currentEarnings + amount;

    // Actualizar earnings en Firestore
    await this.collection.doc(id).update({ earnings: newEarnings });

    // Obtener el documento actualizado para retornar los nuevos datos como DTO
    const updatedDoc = await this.collection.doc(id).get();
    const { name, location } = updatedDoc.data();
    return new SecurityHouseDTO(updatedDoc.id, name, location, []); // Retornar un DTO
  }

  // Obtener todas las security houses
  async getSecurityHouses() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return new SecurityHouseDTO(
        doc.id,
        data.name,
        data.location,
        [] // Asumir que los contratos de trading están vacíos por ahora
      );
    });
  }

  // Obtener una security house por ID
  async getSecurityHouseById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return new SecurityHouseDTO(doc.id, data.name, data.location, []); // Retornar un DTO
  }

  // Obtener security houses por ubicación
  async getSecurityHousesByLocation(location) {
    const querySnapshot = await this.collection
      .where('location', '==', location) // location es un string
      .get();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return new SecurityHouseDTO(
        doc.id,
        data.name,
        data.location,
        [] // Asumir que los contratos de trading están vacíos por ahora
      );
    });
  }

  // Actualizar una security house
  async updateSecurityHouse(id, name, location) {
    const updatedData = {
      name: name,
      location: location // location debe ser un objeto que contenga city y country
    };
    await this.collection.doc(id).update(updatedData);
    const doc = await this.collection.doc(id).get();
    const data = doc.data();
    return new SecurityHouseDTO(doc.id, data.name, data.location, []); // Retornar un DTO
  }

  // Eliminar una security house
  async deleteSecurityHouse(id) {
    await this.collection.doc(id).delete();
    return `Security house with ID ${id} has been deleted.`;
  }
}



module.exports = SecurityHouseDAO;
