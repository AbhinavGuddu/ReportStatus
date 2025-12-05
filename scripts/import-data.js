import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Category from '../models/Category.js';
import Report from '../models/Report.js';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reports-dashboard';

async function importData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Category.deleteMany({});
    await Report.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Existing data cleared!');

    // Read and import categories
    console.log('📂 Importing categories...');
    const categoriesPath = path.join(__dirname, '../mongodb/mongodb/categories.json');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    const categories = categoriesData.trim().split('\n').map(line => JSON.parse(line));
    
    const categoryMap = new Map(); // To map old IDs to new IDs
    
    for (const cat of categories) {
      const newCategory = await Category.create({
        name: cat.name,
        environment: cat.environment,
        order: cat.order,
        createdAt: cat.createdAt?.$date ? new Date(cat.createdAt.$date) : new Date(),
        updatedAt: cat.updatedAt?.$date ? new Date(cat.updatedAt.$date) : new Date()
      });
      categoryMap.set(cat._id.$oid, newCategory._id);
    }
    console.log(`✅ Imported ${categories.length} categories!`);

    // Read and import reports
    console.log('📊 Importing reports...');
    const reportsPath = path.join(__dirname, '../mongodb/mongodb/reports.json');
    const reportsData = fs.readFileSync(reportsPath, 'utf8');
    const reports = reportsData.trim().split('\n').map(line => JSON.parse(line));
    
    for (const report of reports) {
      const categoryId = categoryMap.get(report.category.$oid);
      if (categoryId) {
        await Report.create({
          name: report.name,
          category: categoryId,
          status: report.status,
          environment: report.environment,
          order: report.order,
          createdAt: report.createdAt?.$date ? new Date(report.createdAt.$date) : new Date(),
          updatedAt: report.updatedAt?.$date ? new Date(report.updatedAt.$date) : new Date()
        });
      }
    }
    console.log(`✅ Imported ${reports.length} reports!`);

    // Read and import users
    console.log('👥 Importing users...');
    const usersPath = path.join(__dirname, '../mongodb/mongodb/users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const users = usersData.trim().split('\n').map(line => JSON.parse(line));
    
    for (const user of users) {
      await User.create({
        name: user.name,
        email: user.email,
        role: user.role,
        pin: user.pin,
        isActive: user.isActive,
        addedBy: user.addedBy?.$oid ? user.addedBy.$oid : undefined,
        lastLogin: user.lastLogin?.$date ? new Date(user.lastLogin.$date) : null,
        createdAt: user.createdAt?.$date ? new Date(user.createdAt.$date) : new Date(),
        updatedAt: user.updatedAt?.$date ? new Date(user.updatedAt.$date) : new Date()
      });
    }
    console.log(`✅ Imported ${users.length} users!`);

    console.log('🎉 Data import completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Reports: ${reports.length}`);
    console.log(`   - Users: ${users.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importData();