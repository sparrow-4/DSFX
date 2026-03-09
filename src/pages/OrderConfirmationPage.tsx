import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <CheckCircle className="mx-auto mb-6 h-20 w-20 text-primary" />
        </motion.div>

        <h1 className="mb-3 font-display text-3xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="mb-2 text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          Order #DSFX-{Math.random().toString(36).substring(2, 8).toUpperCase()}
        </p>

        <div className="flex flex-col gap-3">
          <Button size="lg" className="bg-gradient-spark font-display" asChild>
            <Link to="/products">Continue Shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
