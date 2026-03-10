import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, CheckCircle2, Clock, Package, Truck, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { cancelOrder, getImageUrl } from '@/lib/api';
import { toast } from 'sonner';

const API_URL = '/api';

const ALL_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'out for delivery', 'delivered'];
const ICONS = [Banknote, CheckCircle2, Package, Truck, Truck, CheckCircle2];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { token, isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchOrderDetails = () => {
    if (id) {
       setIsLoading(true);
       fetch(`${API_URL}/orders/${id}`, {
         headers: isAuthenticated ? { Authorization: `Bearer ${token}` } : {}
       })
       .then(res => res.json())
       .then(data => {
         setOrder(data);
         setIsLoading(false);
       })
       .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id, isAuthenticated, token]);

  const handleCancelOrder = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setIsCancelling(true);
    try {
      await cancelOrder(id);
      toast.success('Order cancelled successfully');
      fetchOrderDetails(); // Refresh data
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 container mx-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order || order.message === 'Order not found') {
    return (
      <div className="min-h-screen pt-24 px-4 container mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Button asChild><Link to="/">Return to Home</Link></Button>
      </div>
    );
  }

  const currentStatusIndex = ALL_STATUSES.indexOf(order.orderStatus);
  const progressPercentage = order.orderStatus === 'cancelled' ? 0 : Math.max(0, Math.min(100, (currentStatusIndex / (ALL_STATUSES.length - 1)) * 100));

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
            <Link to={isAuthenticated ? "/account/orders" : "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isAuthenticated ? "Back to Orders" : "Back to Home"}
            </Link>
          </Button>
          <h1 className="font-display text-3xl font-bold text-foreground">Order Details</h1>
          <p className="text-muted-foreground mt-1">Order #{order._id}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Tracking Timeline */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold mb-6">Tracking Status</h2>
              
              {order.orderStatus === 'cancelled' ? (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center">
                  <span className="font-bold">This order has been cancelled.</span>
                </div>
              ) : (
                <div className="relative pt-8 pb-4">
                  {/* Progress Bar */}
                  <div className="absolute top-10 left-6 right-6 h-1 bg-secondary rounded-full -z-10">
                    <Progress value={progressPercentage} className="h-full bg-primary" />
                  </div>
                  
                  {/* Timeline Points */}
                  <div className="flex justify-between">
                    {ALL_STATUSES.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const Icon = ICONS[index];
                      
                      return (
                        <div key={status} className="flex flex-col items-center gap-2 z-10 w-16">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                            isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-secondary text-muted-foreground'
                          } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className={`text-[10px] font-bold text-center uppercase tracking-wider ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status History (From model) */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-bold mb-4">Tracking History</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-secondary before:to-transparent">
                  {order.statusTimeline && order.statusTimeline.map((historyItem: any, i: number) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-secondary text-muted-foreground group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Clock className="h-2.5 w-2.5" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-card p-3 rounded border border-border flex justify-between">
                        <span className="font-semibold text-sm capitalize">{historyItem.status}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(historyItem.date), 'MMM d, p')}</span>
                      </div>
                    </div>
                  )).reverse()}
                  {/* If no history (legacy orders), show current status */}
                  {(!order.statusTimeline || order.statusTimeline.length === 0) && (
                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Clock className="h-2.5 w-2.5" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-card p-3 rounded border border-border flex justify-between">
                        <span className="font-semibold text-sm capitalize">{order.orderStatus}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, p')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 p-3 rounded border border-border bg-secondary/10">
                    <img src={item.image ? getImageUrl(item.image) : 'https://placehold.co/100'} alt={item.name} className="h-16 w-16 object-cover rounded bg-secondary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold">₹{item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold mb-4">Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Items Subtotal:</span><span>₹{order.totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-bold"><span className="text-foreground">Grand Total:</span><span>₹{order.totalPrice.toFixed(2)}</span></div>
              </div>

              {isAuthenticated && (order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold mb-4">Shipping Info</h2>
              <p className="font-medium text-sm">{order.customerName}</p>
              <p className="text-sm text-muted-foreground mt-1">{order.address}</p>
              {order.city && <p className="text-sm text-muted-foreground">{order.city}, {order.state} {order.pincode}</p>}
              <p className="text-sm text-muted-foreground mt-2">Phone: {order.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
