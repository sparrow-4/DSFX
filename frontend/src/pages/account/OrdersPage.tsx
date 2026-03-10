import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fetchMyOrders, getImageUrl } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
  shipped: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
  'out for delivery': 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  delivered: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

export default function OrdersPage() {
  const { user, isAuthenticated, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders()
        .then(data => {
          setOrders(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch orders:', err);
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
              <Link to="/account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">Your Orders</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 w-full animate-pulse rounded-lg bg-card border border-border"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground">No orders yet</h2>
            <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't placed any orders with us yet.</p>
            <Button asChild className="bg-gradient-spark">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="bg-secondary/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border text-sm">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase text-xs font-bold tracking-wider">Order Placed</p>
                      <p className="font-medium text-foreground">{format(new Date(order.createdAt), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase text-xs font-bold tracking-wider">Total</p>
                      <p className="font-medium text-foreground">₹{order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase text-xs font-bold tracking-wider">Ship To</p>
                      <p className="font-medium text-primary cursor-pointer hover:underline">{order.customerName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 uppercase text-xs font-bold tracking-wider text-right">Order #</p>
                    <p className="font-mono text-foreground">{order._id}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      {order.orderStatus === 'delivered' ? <CheckCircle className="text-green-500 h-5 w-5" /> : <Clock className="text-yellow-500 h-5 w-5" />}
                      <span className="capitalize">{order.orderStatus}</span>
                    </h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/order/${order._id}`}>
                        Track Order <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary/20">
                          {item.image ? (
                            <img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-secondary">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <Link to={`/products/${item.productId}`} className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
                            {item.name}
                          </Link>
                          <div className="text-sm text-muted-foreground flex gap-4">
                            <span>Qty: {item.quantity}</span>
                            <span>₹{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
