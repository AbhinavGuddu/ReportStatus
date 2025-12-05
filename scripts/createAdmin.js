// Run this script once to create the default admin user
// node scripts/createAdmin.js

import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reports-dashboard';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ name: 'Abhinav', role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const admin = await User.create({
      name: 'Abhinav',
      email: 'abhinav.guddu@ADP.com',
      role: 'admin',
      pin: '551911',
      isActive: true
    });

    console.log('✅ Admin user created successfully:', admin.name);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();