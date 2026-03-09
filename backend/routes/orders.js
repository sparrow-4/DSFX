import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';
import { verifyAdmin, verifyUser, JWT_SECRET } from '../middleware/auth.js';

// POST create order (public or authenticated)
router.post('/', async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id; // Map customer ID to order
      } catch (err) {
        // Proceed as guest if token is invalid
      }
    }

    const { customerName, email, phone, address, items, totalPrice } = req.body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    // Checking Stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    const order = new Order({
      userId,
      customerName,
      email: email || '',
      phone,
      address,
      items,
      totalPrice,
    });

    await order.save();

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET user's own orders
router.get('/my-orders', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find orders for this user. We don't filter by status so "delivered" is included.
    const orders = await Order.find({ 
      $or: [
        { userId: userId },
        { userId: new mongoose.Types.ObjectId(userId) }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single order (public/customer)
router.get('/:id([0-9a-fA-F]{24})', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update order status (admin)
router.put('/:id([0-9a-fA-F]{24})/status', verifyAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) return res.status(404).json({ message: 'Order not found' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    // If order is cancelled, restore stock
    if (orderStatus === 'cancelled' && oldOrder.orderStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE order (admin)
router.delete('/:id([0-9a-fA-F]{24})', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT cancel order (user-initiated)
router.put('/:id([0-9a-fA-F]{24})/cancel', verifyUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Security check: Ensure order belongs to this user
    const userId = req.user.id;
    if (!order.userId || (order.userId.toString() !== userId && order.userId.toString() !== new mongoose.Types.ObjectId(userId).toString())) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Status check: Only pending or confirmed orders can be cancelled by user
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel order in ${order.orderStatus} status` });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore stock for cancelled order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
