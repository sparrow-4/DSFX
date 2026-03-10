import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import AdminUser from './models/AdminUser.js';
import Category from './models/Category.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://thoyyibcherur_db_user:eOy4YA1T2gI89WsV@cluster0.duh9afm.mongodb.net/?appName=Cluster0';

const demoProducts = [];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await AdminUser.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing products, categories and admin users');

    // Seed categories
    const demoCategories = [
      { name: 'Spark Machines', slug: 'spark-machines', description: 'Cold spark and titanium spark systems' },
      { name: 'CO2 Effects', slug: 'co2-effects', description: 'Cryogenic CO2 jets and cannons' },
      { name: 'Flame Effects', slug: 'flame-effects', description: 'Controllable flame projectors' },
      { name: 'Fog & Haze', slug: 'fog-haze', description: 'Professional fog and haze machines' },
      { name: 'Confetti & Streamers', slug: 'confetti-streamers', description: 'Confetti cannons and streamer launchers' },
      { name: 'Pyrotechnics', slug: 'pyrotechnics', description: 'Indoor and outdoor pyrotechnic effects' },
    ];
    await Category.insertMany(demoCategories);
    console.log(`✅ Inserted ${demoCategories.length} categories`);

    // Seed products
    await Product.insertMany(demoProducts);
    console.log(`✅ Inserted ${demoProducts.length} demo products`);

    // Seed admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await AdminUser.create({ username: 'admin', email: 'admin@example.com', password: hashedPassword, role: 'admin' });
    console.log('✅ Created admin user: admin / admin123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
