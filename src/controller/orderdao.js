const { db } = require('../firebase'); // Import the Firestore database instance
const OrderDTO = require('../model/orderdto'); // Import the OrderDTO

class OrderDAO {
    constructor() {
        this.collection = db.collection('orders'); // Firestore collection for orders
    }

    // Method to create a new order
    async createOrder(orderData) {
        const { type, quantity, price, stockSymbol, investorId, date, status } = orderData;
        
        if (type && quantity && price && stockSymbol && investorId && date && status) {
            const order = new OrderDTO({ ...orderData });
            const docRef = await this.collection.add({ ...order });
            return { id: docRef.id, ...order };
        } else {
            throw new Error('All fields are required');
        }
    }

    // Method to get an order by ID
    async getOrderById(orderId) {
        const doc = await this.collection.doc(orderId).get();
        if (!doc.exists) {
            throw new Error(`Order with ID ${orderId} not found`);
        }
        return { id: doc.id, ...doc.data() };
    }

    // Method to get all orders
    async getAllOrders() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Method to update an order by ID
    async updateOrder(orderId, orderData) {
        const { type, quantity, price, stockSymbol, investorId, date, status } = orderData;

        if (type && quantity && price && stockSymbol && investorId && date && status) {
            const docRef = this.collection.doc(orderId);
            await docRef.update(orderData);
            return { id: orderId, ...orderData };
        } else {
            throw new Error('All fields are required for updating');
        }
    }

    // Method to delete an order by ID
    async deleteOrder(orderId) {
        await this.collection.doc(orderId).delete();
        return { message: `Order with ID ${orderId} deleted successfully` };
    }
}

module.exports = OrderDAO;
