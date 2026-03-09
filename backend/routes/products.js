import express from 'express';
const router = express.Router();
import Product from '../models/Product.js';
import upload from '../middleware/upload.js';
import { verifyAdmin } from '../middleware/auth.js';

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product (admin)
router.post('/', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, stock, featured, rating, reviewCount } = req.body;

    // Parse specifications from JSON string
    let specifications = {};
    if (req.body.specifications) {
      try {
        specifications = JSON.parse(req.body.specifications);
      } catch {
        specifications = req.body.specifications;
      }
    }

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      stock: parseInt(stock) || 0,
      specifications,
      images,
      featured: featured === 'true' || featured === true,
      rating: rating ? parseFloat(rating) : 0,
      reviewCount: reviewCount ? parseInt(reviewCount) : 0,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product (admin)
router.put('/:id', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, stock, featured, rating, reviewCount, existingImages } = req.body;

    // Parse specifications
    let specifications = {};
    if (req.body.specifications) {
      try {
        specifications = JSON.parse(req.body.specifications);
      } catch {
        specifications = req.body.specifications;
      }
    }

    // Combine existing images (kept) with newly uploaded
    let images = [];
    if (existingImages) {
      images = Array.isArray(existingImages) ? existingImages : [existingImages];
    }
    if (req.files && req.files.length > 0) {
      images = [...images, ...req.files.map((f) => `/uploads/${f.filename}`)];
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        category,
        stock: parseInt(stock) || 0,
        specifications,
        images,
        featured: featured === 'true' || featured === true,
        rating: rating ? parseFloat(rating) : 0,
        reviewCount: reviewCount ? parseInt(reviewCount) : 0,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
