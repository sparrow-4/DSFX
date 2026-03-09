import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import Order from '../models/Order.js';
import { JWT_SECRET, verifyAdmin } from '../middleware/auth.js';

// POST admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const admin = await AdminUser.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET verify token (check if still valid)
router.get('/verify', verifyAdmin, (req, res) => {
  res.json({ valid: true, username: req.admin.username });
});

// GET /api/admin/reports - Order Analytics
router.get('/reports', verifyAdmin, async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    // 1. Total Metrics (Revenue, Orders)
    const metricsAggregation = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
        }
      }
    ]);
    const metrics = metricsAggregation[0] || { totalRevenue: 0, totalOrders: 0 };

    // 2. Orders by Status
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Daily Revenue and Orders (Last 30 Days)
    const dailyData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      metrics,
      statusDistribution: statusDistribution.map(d => ({ name: d._id, value: d.count })),
      dailyData: dailyData.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
