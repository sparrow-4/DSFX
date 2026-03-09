import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import AdminUser from './models/AdminUser.js';
import Category from './models/Category.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://thoyyibcherur_db_user:eOy4YA1T2gI89WsV@cluster0.duh9afm.mongodb.net/?appName=Cluster0';

const demoProducts = [
  {
    name: 'TitanSpark Pro Cold Spark Machine',
    description: 'Professional cold spark machine with DMX control. Creates stunning 5-meter spark fountains safe for indoor venues. Features adjustable spark height and duration with wireless remote. Perfect for weddings, concerts, and corporate events.',
    price: 1299.99,
    originalPrice: 1499.99,
    category: 'Spark Machines',
    stock: 15,
    images: [],
    specifications: new Map([
      ['Power', '750W'],
      ['Spark Height', '1-5 meters'],
      ['Control', 'DMX512, Wireless Remote'],
      ['Weight', '12kg'],
      ['Dimensions', '40x30x25cm'],
    ]),
    featured: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    name: 'CryoBlast CO2 Jet Machine',
    description: 'High-powered CO2 jet system producing dramatic cryogenic plumes up to 8 meters. Perfect for concerts, festivals, and club events. DMX controllable with instant response. Includes CO2 hose and quick-connect fitting.',
    price: 899.99,
    category: 'CO2 Effects',
    stock: 22,
    images: [],
    specifications: new Map([
      ['Jet Height', 'Up to 8 meters'],
      ['CO2 Consumption', '1kg per 3 seconds burst'],
      ['Control', 'DMX512'],
      ['Connection', 'Standard CO2 tank fitting'],
      ['Weight', '8kg'],
    ]),
    featured: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    name: 'Stage Smoke & Fog Machine Pro',
    description: 'Professional smoke machine delivering consistent, thick fog output ideal for stage productions, film sets, and theatrical performances. Variable output control with remote trigger system.',
    price: 649.99,
    category: 'Fog & Haze',
    stock: 30,
    images: [],
    specifications: new Map([
      ['Output', '3000 cubic ft/min'],
      ['Fluid Tank', '5 liters'],
      ['Heat-Up Time', '8 minutes'],
      ['Control', 'DMX512, Manual'],
      ['Weight', '9kg'],
    ]),
    featured: true,
    rating: 4.7,
    reviewCount: 103,
  },
  {
    name: 'ConfettiStorm Electric Cannon',
    description: 'High-capacity electric confetti cannon launching up to 15kg of confetti 20 meters high. Perfect for celebrations, award ceremonies, and outdoor events. DMX integration and reloadable design for multiple shots.',
    price: 749.99,
    category: 'Confetti & Streamers',
    stock: 30,
    images: [],
    specifications: new Map([
      ['Capacity', '15kg confetti'],
      ['Range', '20 meters'],
      ['Trigger', 'Electric/DMX'],
      ['Reloadable', 'Yes'],
      ['Weight', '14kg'],
    ]),
    featured: true,
    rating: 4.6,
    reviewCount: 78,
  },
  {
    name: 'InfernoFX Stage Flame Machine',
    description: 'DMX-controlled flame effect machine with adjustable flame height from 0.5 to 3 meters. Built-in safety features including flame sensor, temperature monitoring, and auto-shutoff. Certified for indoor and outdoor use.',
    price: 2199.99,
    originalPrice: 2499.99,
    category: 'Flame Effects',
    stock: 8,
    images: [],
    specifications: new Map([
      ['Flame Height', '0.5-3 meters'],
      ['Fuel', 'Propane/LPG'],
      ['Control', 'DMX512, Manual'],
      ['Safety', 'Flame sensor, Auto-shutoff'],
      ['Weight', '18kg'],
    ]),
    featured: true,
    rating: 4.7,
    reviewCount: 56,
  },
];

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
    await AdminUser.create({ username: 'admin', password: hashedPassword , role: 'admin' });
    console.log('✅ Created admin user: admin / admin123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
