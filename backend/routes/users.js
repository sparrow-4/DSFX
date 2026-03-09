import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Middleware to verify customer/user token
// We duplicate a simplified version of auth here since auth.js verifyAdmin checks for admin role explicitly
// In a real app we'd combine them, but let's keep it simple
const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('VerifyUser - No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('VerifyUser - Successful for User ID:', decoded.id);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error('VerifyUser - Token Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// GET /api/users/me
router.get('/me', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me/orders
router.get('/me/orders', verifyUser, async (req, res) => {
  try {
    // We will update Order schema to include userId shortly
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me -> Update profile (for address)
router.put('/me', verifyUser, async (req, res) => {
  try {
    const updates = req.body;
    // prevent updating sensitive fields directly
    delete updates.role;
    delete updates.googleId;
    delete updates.email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-__v');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export { router as default, verifyUser };
