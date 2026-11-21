const mongoose = require('mongoose');

let isConnected = false;
let memoryMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillgap_ai';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    memoryMode = false;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Notice: MongoDB connection to ${uri} failed (${error.message}).`);
    console.warn(`[Database] Activating Resilient In-Memory Data Store fallback mode. App will function fully without external DB.`);
    isConnected = false;
    memoryMode = true;
    return null;
  }
};

const getDbStatus = () => ({
  isConnected: mongoose.connection.readyState === 1,
  memoryMode: memoryMode || mongoose.connection.readyState !== 1,
  host: mongoose.connection.readyState === 1 ? mongoose.connection.host : 'In-Memory Store',
});

module.exports = {
  connectDB,
  getDbStatus,
};
