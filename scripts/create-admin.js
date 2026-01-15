/**
 * Create Default Admin User Script
 * Run this script to create a default admin account for testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../dist/models/User').default;

const DEFAULT_ADMIN = {
  email: 'admin@safenet.app',
  password: 'Admin123!',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+233123456789',
  role: 'admin',
  isActive: true,
};

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/safenet';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', DEFAULT_ADMIN.email);
      console.log('To reset password, delete the user first or update manually.');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = new User(DEFAULT_ADMIN);
    await admin.save();

    console.log('\n✅ Default admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email:', DEFAULT_ADMIN.email);
    console.log('   Password:', DEFAULT_ADMIN.password);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
