import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { Lock, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 49.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      navigate('/order-confirmation');
    }, 1500);
  };

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

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
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
                <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" required /></div>
                <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" required /></div>
              </div>
            </motion.div>

            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 rounded-lg border border-border bg-card p-6"
            >
              <h2 className="font-display text-lg font-semibold text-foreground">Shipping Address</h2>
              <div className="space-y-4">
                <div><Label htmlFor="street">Street Address</Label><Input id="street" required /></div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div><Label htmlFor="city">City</Label><Input id="city" required /></div>
                  <div><Label htmlFor="state">State</Label><Input id="state" required /></div>
                  <div><Label htmlFor="zip">ZIP Code</Label><Input id="zip" required /></div>
                </div>
              </div>
            </motion.div>

            {/* Payment placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 rounded-lg border border-border bg-card p-6"
            >
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment
              </h2>
              <div className="grid gap-4">
                <div><Label htmlFor="card">Card Number</Label><Input id="card" placeholder="•••• •••• •••• ••••" required /></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><Label htmlFor="expiry">Expiry</Label><Input id="expiry" placeholder="MM/YY" required /></div>
                  <div><Label htmlFor="cvc">CVC</Label><Input id="cvc" placeholder="•••" required /></div>
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
                      ${(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-spark font-display"
                disabled={loading}
              >
                <Lock className="mr-2 h-4 w-4" />
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
