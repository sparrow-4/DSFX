import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Lock, MapPin } from 'lucide-react';
import { createOrder } from '@/lib/api';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 49.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const customerName = `${data.get('firstName') || ''} ${data.get('lastName') || ''}`.trim();
    const email = (data.get('email') as string) || '';
    const phone = (data.get('phone') as string) || '';
    
    let street = data.get('street') as string;
    let city = data.get('city') as string;
    let state = data.get('state') as string;
    let district = data.get('district') as string || '';
    let pincode = data.get('zip') as string;

    const address = `${street}, ${city}, ${state} ${pincode}`;

    setLoading(true);
    try {
      const order = await createOrder({
        customerName,
        email,
        phone,
        address,
        city,
        state,
        district,
        pincode,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0] || '',
        })),
        totalPrice: total,
      });
      clearCart();
      navigate('/order-confirmation', { state: { orderId: order._id } });
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center space-y-4 max-w-sm px-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Sign In Required</h2>
          <p className="text-muted-foreground text-sm">You must be logged in to place an order. This helps us track your order and keep you updated.</p>
          <Button asChild className="w-full bg-gradient-spark mt-4">
            <a href="/login?redirect=/checkout">Sign In with Google</a>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Your Cart is Empty</h2>
          <Button asChild>
            <a href="/products">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-display text-3xl font-bold text-foreground"
        >
          Checkout
        </motion.h1>

        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
          {/* Form */}
          <div className="space-y-8 lg:col-span-2">
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 rounded-lg border border-border bg-card p-6"
            >
              <h2 className="font-display text-lg font-semibold text-foreground">Contact Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" name="firstName" defaultValue={user?.name?.split(' ')[0] || ''} required /></div>
                <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" name="lastName" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" defaultValue={user?.email || ''} readOnly className="bg-muted cursor-not-allowed" /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" defaultValue={user?.phone || ''} required /></div>
              </div>
            </motion.div>

            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6 rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-foreground">Delivery Address</h2>
              </div>
              
              <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium text-foreground">Delivery Address Details:</h3>
                  <div><Label htmlFor="street">Street / Building</Label><Input id="street" name="street" required /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><Label htmlFor="city">City / Town</Label><Input id="city" name="city" required /></div>
                    <div><Label htmlFor="district">District</Label><Input id="district" name="district" /></div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><Label htmlFor="state">State</Label><Input id="state" name="state" required /></div>
                    <div><Label htmlFor="zip">ZIP / PIN Code</Label><Input id="zip" name="zip" required /></div>
                  </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="sticky top-24 space-y-4 rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-foreground">
                      ₹{(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-spark font-display"
                disabled={loading}
              >
                <Lock className="mr-2 h-4 w-4" />
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
