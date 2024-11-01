// dao/UserDAO.js
const { db } = require('../firebase')
const UserDTO = require('../model/userdto');


class UserDAO {
  constructor() {
    this.collection = db.collection('users'); // Firestore collection for users
  }

// Create a new user
async createUser(gmail, password, type, idtype) {
  const docRef = await this.collection.add({
    gmail: gmail,
    password: password,
    type: type,
    idtype: idtype
  });
  return {
    id: docRef.id,
    gmail: gmail,
    password: password,
    type: type,
    idtype: idtype
  };
}

  // Get all users
  async getUsers() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => new UserDTO(
      doc.id,
      doc.data().gmail,
      doc.data().password,
      doc.data().type,
      doc.data().idtype
    ));
  }

  // Get a user by ID
  async getUserById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return new UserDTO(doc.id, data.gmail, data.password, data.type, data.idtype);
  }

// Update a user
async updateUser(id, gmail, password, type, idtype) {
  const updatedData = {
    gmail: gmail,
    password: password,
    type: type,
    idtype: idtype
  };
  
  await this.collection.doc(id).update(updatedData);
  const doc = await this.collection.doc(id).get();
  
  return new UserDTO(
    doc.id,
    doc.data().gmail,
    doc.data().password,
    doc.data().type,
    doc.data().idtype
  );
}

  // Delete a user
  async deleteUser(id) {
    await this.collection.doc(id).delete();
    return `User with ID ${id} has been deleted.`;
  }

  async authenticateUser(email, password) {
    const snapshot = await this.collection
      .where('gmail', '==', email)
      .where('password', '==', password)
      .get();

    return !snapshot.empty; // Returns true if a matching user is found, false otherwise
  }

  // Get the type of user by email
  async getUserTypeByEmail(email) {
    const snapshot = await this.collection
      .where('gmail', '==', email)
      .limit(1) // Limit to one result
      .get();

    if (snapshot.empty) {
      return null; // No user found with the given email
    }

    const userData = snapshot.docs[0].data();
    return userData.type; // Return the user's type
  }

    // Get a user by email
  async getUserByEmail(email) {
    const snapshot = await this.collection
      .where('gmail', '==', email)
      .limit(1) // Limitar a un resultado
      .get();

    if (snapshot.empty) {
      return null; // No user found with the given email
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return new UserDTO(doc.id, data.gmail, data.password, data.type, data.idtype);
  }
}

module.exports = UserDAO;
