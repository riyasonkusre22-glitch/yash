const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, Node c-ares DNS resolver can fail with querySrv ECONNREFUSED when using local router DNS.
// Setting reliable DNS servers ensures MongoDB Atlas SRV lookup succeeds seamlessly.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://riyasonkusre22_db_user:3TDUjQkp1B3JtnaP@yash.8lus1h9.mongodb.net/yash_tutorials?retryWrites=true&w=majority';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Connected to Atlas Host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠ MongoDB connection error: ${error.message}`);
    console.warn('⚠ Server will run with in-memory fallback for offline development.');
  }
};

module.exports = connectDB;
