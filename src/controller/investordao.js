// dao/InvestorDAO.js
const { db } = require('../firebase');
const InvestorDTO = require('../model/investordto');
const UserDAO = require('./userdao');
const TradingContractDAO = require('./tradingcontractdao');

class InvestorDAO {
    constructor() {
        this.collection = db.collection('investors');
        this.userDAO = new UserDAO();
        this.tradingContractDAO = new TradingContractDAO();
    }

// Crear un nuevo inversionista
async createInvestor({ name, address, phone, investmentCapacity }) {
    // Calcular riskProfile en función de investmentCapacity
    const riskProfile = this.calculateRiskProfile(investmentCapacity);
    
    // Crear el documento en la base de datos
    const docRef = await this.collection.add({
        name,
        address,
        phone,
        investmentCapacity,
        riskProfile,
        profitStatus: "nn", 
        contracts: [] // Inicia vacío
    });

    // Obtener los datos del documento recién creado
    const docSnapshot = await docRef.get();

    return { id: docRef.id, ...docSnapshot.data() };
}


    async getInvestors() {
        const snapshot = await this.collection.get();
        const investors = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            return new InvestorDTO({
                id: doc.id,
                ...data,
            });
        }));
        return investors;
    }
    
    

   // Obtener un inversionista por su ID
async getInvestorById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() };

}


    // Actualizar información de un inversionista
    async updateInvestor(id, name, address, phone, investmentCapacity) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return null;

        const riskProfile = this.calculateRiskProfile(investmentCapacity);

        await this.collection.doc(id).update({
            name,
            address,
            phone,
            investmentCapacity,
            riskProfile
        });
        
        const updatedDoc = await this.collection.doc(id).get();

        return { id: doc.id, ...doc.data() };

    }

    // Eliminar un inversionista por su ID
    async deleteInvestor(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) return `Investor with ID ${id} does not exist.`;

        await this.collection.doc(id).delete();
        return `Investor with ID ${id} has been deleted.`;
    }

    // Calcular el perfil de riesgo en función de la capacidad de inversión
    calculateRiskProfile(investmentCapacity) {
        if (investmentCapacity < 80) return 'Low';
        else if (investmentCapacity < 150) return 'Medium';
        else return 'High';
    }
}

module.exports = InvestorDAO;
