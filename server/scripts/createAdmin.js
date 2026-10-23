require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

async function createAdmin() {
  const args = process.argv.slice(2);
  const emailArg = args[0] || process.env.ADMIN_EMAIL || 'admin@yashtutorials.com';
  const passwordArg = args[1] || process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!passwordArg) {
    console.error('❌ Error: Password is required to provision administrator.');
    console.log('Usage: node scripts/createAdmin.js <email> <password>');
    console.log('Or set ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD in server/.env');
    process.exit(1);
  }

  if (passwordArg.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long for security.');
    process.exit(1);
  }

  const cleanEmail = String(emailArg).trim().toLowerCase();

  console.log('🔄 Connecting to MongoDB Atlas...');
  await connectDB();

  let admin = await Admin.findOne({ email: cleanEmail }).select('+password');

  if (admin) {
    console.log(`ℹ Found existing admin account for: ${cleanEmail}. Updating password...`);
    admin.password = passwordArg;
    admin.isActive = true;
    await admin.save();
    console.log(`✅ Administrator credentials updated successfully for: ${cleanEmail}`);
  } else {
    admin = new Admin({
      email: cleanEmail,
      password: passwordArg,
      name: 'Yash Tutorials Admin',
      role: 'superadmin',
      isActive: true
    });
    await admin.save();
    console.log(`✅ Initial Administrator account provisioned successfully for: ${cleanEmail}`);
  }

  await mongoose.connection.close();
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('❌ Failed to provision administrator:', err.message || err);
  process.exit(1);
});
