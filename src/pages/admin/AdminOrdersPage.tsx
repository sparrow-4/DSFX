import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchOrders, updateOrderStatus, deleteOrder, type ApiOrder } from '@/lib/api';
import { useAdminStore } from '@/store/adminStore';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchOrders,
  });

  const handleStatusChange = async (order: ApiOrder, newStatus: string) => {
    setUpdatingId(order._id);
    try {
      await updateOrderStatus(order._id, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteOrder(id);
      toast.success('Order deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };



  return (
    <div className="min-h-screen bg-background">


      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary/50" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                layout
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                {/* Order row */}
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.phone} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-display font-bold text-foreground">₹{order.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{order.items.length} item(s)</p>
                  </div>

                  {/* Status select */}
                  <div className="relative">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      disabled={updatingId === order._id}
                      className={`appearance-none rounded-full border px-3 py-1 pr-7 text-xs font-medium cursor-pointer focus:outline-none ${STATUS_COLORS[order.orderStatus] || 'bg-secondary text-foreground border-border'}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-card text-foreground">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2" />
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                      className="text-xs text-muted-foreground"
                    >
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(order._id)}
                      disabled={deletingId === order._id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedId === order._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-secondary/20 px-4 py-3"
                  >
                    <div className="mb-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Address: </span>
                        <span className="text-foreground">{order.address}</span>
                      </div>
                      {order.email && (
                        <div>
                          <span className="text-muted-foreground">Email: </span>
                          <span className="text-foreground">{order.email}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground text-xs">Order ID: </span>
                        <span className="font-mono text-xs text-foreground">{order._id}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md bg-background/50 px-3 py-1.5 text-sm">
                          <span className="text-foreground">{item.name} × {item.quantity}</span>
                          <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
