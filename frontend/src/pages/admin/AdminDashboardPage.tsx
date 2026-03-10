import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingBag, Clock, IndianRupee, BarChart3, Settings, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchProducts, fetchOrders, fetchCategories } from '@/lib/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchOrders,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories,
  });

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-400' },
    { label: 'Total Categories', value: categories.length, icon: Package, color: 'text-purple-400' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-green-400' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-yellow-400' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: IndianRupee, color: 'text-primary' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Dashboard <span className="text-gradient-spark">Overview</span>
          </h1>
          <p className="mt-1 text-muted-foreground">Manage your Spark Stage Store</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`mt-1 font-display text-2xl font-bold text-foreground`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Categories</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Manage your product categories, add new categories, and edit their details.</p>
            <Button asChild variant="outline" className="w-full font-display">
              <Link to="/admin/categories">Manage Categories</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Products</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Manage your product catalog, add new items, edit details, and upload images.</p>
            <Button asChild className="w-full bg-gradient-spark font-display">
              <Link to="/admin/products">Manage Products</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Orders</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">View customer orders, update statuses, and track fulfillment progress.</p>
            <Button asChild variant="outline" className="w-full font-display">
              <Link to="/admin/orders">Manage Orders</Link>
            </Button>
          </motion.div>

          {/* Added Reports Quick Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Analytics</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">View comprehensive order reports, revenue charts, and performance metrics.</p>
            <Button asChild variant="secondary" className="w-full font-display">
              <Link to="/admin/reports">View Reports</Link>
            </Button>
          </motion.div>

          {/* Settings Quick Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Settings</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Update your store information, contact details, and dynamic content.</p>
            <Button asChild variant="outline" className="w-full font-display">
              <Link to="/admin/settings">Edit Settings</Link>
            </Button>
          </motion.div>
        </div>

        {/* Quick nav to store */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Globe className="h-4 w-4" /> View Store
          </Link>
        </motion.div>
      </div>
  );
}
