require('dotenv').config()

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

try {
  initializeApp({
    credential: applicationDefault()
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

const db = getFirestore();

console.log('Firestore instance:', db ? 'Initialized' : 'Not initialized');

module.exports = { db };
