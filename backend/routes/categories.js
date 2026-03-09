import express from 'express';
const router = express.Router();
import Category from '../models/Category.js';
import { verifyAdmin } from '../middleware/auth.js';

// GET all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create category (admin)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const slug = name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    const category = new Category({ name, slug, description: description || '' });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A category with that name already exists' });
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT update category (admin)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name ? name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') : undefined;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name, slug }), ...(description !== undefined && { description }) },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A category with that name already exists' });
    }
    res.status(400).json({ message: err.message });
  }
});

// DELETE category (admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
