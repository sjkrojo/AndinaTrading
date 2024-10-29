// dto/LogDTO.js
class LogDTO {
    constructor(id, level, message, timestamp, context = {}) {
      this.id = id; // Unique identifier for the log entry
      this.level = level; // Log level (e.g., INFO, WARN, ERROR)
      this.message = message; // Log message
      this.timestamp = timestamp; // Timestamp of the log entry
      this.context = context; // Optional additional context (e.g., user info, request ID)
    }
  }
  
  module.exports = LogDTO;
  