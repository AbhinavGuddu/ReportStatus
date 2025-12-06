import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://fybzfiunjgesuionbjuk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5YnpmaXVuamdlc3Vpb25ianVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMzk5ODgsImV4cCI6MjA4MDYxNTk4OH0.8n6LpaTP9l-iNobkNyDasa4I2E128zYDTowwJT0djYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  try {
    console.log('🚀 Starting Supabase migration...\n');

    // Read MongoDB export files
    const categoriesPath = path.join(__dirname, '../mongodb/mongodb/categories.json');
    const reportsPath = path.join(__dirname, '../mongodb/mongodb/reports.json');
    const usersPath = path.join(__dirname, '../mongodb/mongodb/users.json');

    const categoriesData = fs.readFileSync(categoriesPath, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    const reportsData = fs.readFileSync(reportsPath, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    const usersData = fs.readFileSync(usersPath, 'utf8').trim().split('\n').map(line => JSON.parse(line));

    console.log(`📂 Found ${categoriesData.length} categories`);
    console.log(`📊 Found ${reportsData.length} reports`);
    console.log(`👥 Found ${usersData.length} users\n`);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleared!\n');

    // Migrate categories
    console.log('📂 Migrating categories...');
    const categoryMap = new Map();
    
    for (const cat of categoriesData) {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: cat.name,
          environment: cat.environment,
          order: cat.order,
          created_at: cat.createdAt?.$date || new Date().toISOString(),
          updated_at: cat.updatedAt?.$date || new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error inserting category ${cat.name}:`, error);
      } else {
        categoryMap.set(cat._id.$oid, data.id);
        console.log(`✅ ${cat.name}`);
      }
    }
    console.log(`\n✅ Migrated ${categoryMap.size} categories!\n`);

    // Migrate reports
    console.log('📊 Migrating reports...');
    let reportCount = 0;
    
    for (const report of reportsData) {
      const categoryId = categoryMap.get(report.category.$oid);
      if (!categoryId) {
        console.log(`⚠️  Skipping ${report.name} - category not found`);
        continue;
      }

      const { error } = await supabase
        .from('reports')
        .insert({
          name: report.name,
          category_id: categoryId,
          status: report.status,
          environment: report.environment,
          order: report.order,
          updated_by: report.updatedBy || null,
          created_at: report.createdAt?.$date || new Date().toISOString(),
          updated_at: report.updatedAt?.$date || new Date().toISOString()
        });

      if (error) {
        console.error(`❌ Error inserting report ${report.name}:`, error);
      } else {
        reportCount++;
        if (reportCount % 20 === 0) {
          console.log(`✅ Migrated ${reportCount} reports...`);
        }
      }
    }
    console.log(`\n✅ Migrated ${reportCount} reports!\n`);

    // Migrate users
    console.log('👥 Migrating users...');
    
    for (const user of usersData) {
      const { error } = await supabase
        .from('users')
        .insert({
          name: user.name,
          email: user.email,
          role: user.role,
          pin: user.pin || null,
          is_active: user.isActive !== false,
          last_login: user.lastLogin?.$date || null,
          created_at: user.createdAt?.$date || new Date().toISOString(),
          updated_at: user.updatedAt?.$date || new Date().toISOString()
        });

      if (error) {
        console.error(`❌ Error inserting user ${user.name}:`, error);
      } else {
        console.log(`✅ ${user.name} (${user.role})`);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categoryMap.size}`);
    console.log(`   - Reports: ${reportCount}`);
    console.log(`   - Users: ${usersData.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
