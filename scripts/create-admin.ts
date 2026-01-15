/**
 * Create Default Admin User Script
 * Run this script to create a default admin account for testing
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User';
import { UserRole } from '../src/types';
import { connectDatabase } from '../src/config/database';

dotenv.config();

const DEFAULT_ADMIN = {
  email: 'admin@safenet.app',
  password: 'Admin123!',
  firstName: 'Admin',
  lastName: 'User',
  phone: '+233123456789',
  role: UserRole.ADMIN,
  isActive: true,
};

async function createAdmin() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('   Updating password and ensuring admin role...');
      
      // Update password and role
      existingAdmin.password = DEFAULT_ADMIN.password;
      existingAdmin.role = DEFAULT_ADMIN.role;
      existingAdmin.isActive = DEFAULT_ADMIN.isActive;
      await existingAdmin.save();
      
      console.log('✅ Admin user updated successfully!');
    } else {
      // Create admin user
      const admin = new User(DEFAULT_ADMIN);
      await admin.save();
      console.log('✅ Default admin user created successfully!');
    }

    console.log('\n📧 Login Credentials:');
    console.log('   Email:', DEFAULT_ADMIN.email);
    console.log('   Password:', DEFAULT_ADMIN.password);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
