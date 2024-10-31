// dto/UserDTO.js
class UserDTO {
    constructor(id, gmail, password, type, idtype) {
      this.id = id;         // Unique identifier for the user
      this.gmail = gmail;    // Gmail address of the user
      this.password = password; // User password
      this.type = type;      // Type of the user (e.g., 'admin', 'customer')
      this.idtype = idtype;
    }
  }
  
  module.exports = UserDTO;
  