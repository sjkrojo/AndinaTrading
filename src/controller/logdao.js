// dao/LogDAO.js
const { db } = require('../firebase')
const LogDTO = require('../model/logdto');

class LogDAO {
  constructor() {
    this.collection = db.collection('logs'); // Firestore collection for logs
  }

// Create a new log entry
async createLog(level, message, timestamp, context = null) {
  const docRef = await this.collection.add({
    level: level,
    message: message,
    timestamp: timestamp,
    context: context // Optional additional context
  });
  return { id: docRef.id, level, message, timestamp, context }; // Return the created log entry with its ID and attributes
}


  // Get log entries between two dates
  async getLogsBetweenDates(startDate, endDate) {
    const snapshot = await this.collection
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate)
      .get();

    return snapshot.docs.map(doc => new LogDTO(
      doc.id,
      doc.data().level,
      doc.data().message,
      doc.data().timestamp,
      doc.data().context
    ));
  }

  // Get all log entries
  async getLogs() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => new LogDTO(
      doc.id,
      doc.data().level,
      doc.data().message,
      doc.data().timestamp,
      doc.data().context // Include additional context
    ));
  }

  // Get log entry by ID
  async getLogById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null; // Return null if the log does not exist
    const data = doc.data();
    return new LogDTO(doc.id, data.level, data.message, data.timestamp, data.context);
  }

  // Update a log entry (not typical, but can be done)
  async updateLog(id, updatedData) {
    await this.collection.doc(id).update(updatedData);
    const doc = await this.collection.doc(id).get();
    return new LogDTO(doc.id, doc.data().level, doc.data().message, doc.data().timestamp, doc.data().context);
  }

  // Delete a log entry
  async deleteLog(id) {
    await this.collection.doc(id).delete();
    return `Log entry with ID ${id} has been deleted.`;
  }
}

module.exports = LogDAO;
