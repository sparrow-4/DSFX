import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Check, Truck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductById } from '@/data/products';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Product Not Found</h2>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, qty);
    openCart();
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-xl border border-border bg-secondary"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="outline" className="mb-3 font-display text-xs">
                {product.category}
              </Badge>
              <h1 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                {product.name}
              </h1>
              {product.rating && (
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating!) ? 'fill-primary text-primary' : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-black text-foreground">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                {product.stockQuantity > 0
                  ? `${product.stockQuantity} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <span className="w-12 text-center text-sm font-medium text-foreground">{qty}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQty(qty + 1)}
                  className="rounded-l-none"
                >
                  +
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-gradient-spark font-display"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              Free shipping on orders over $500
            </div>

            {/* Specifications */}
            <div className="border-t border-border pt-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between rounded-lg bg-secondary/50 px-4 py-2.5">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
