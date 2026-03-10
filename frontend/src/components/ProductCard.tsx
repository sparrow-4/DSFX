import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
    
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card"
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-square bg-secondary">
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        {isOutOfStock ? (
          <span className="absolute left-3 top-3 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
            Sold Out
          </span>
        ) : discount > 0 ? (
          <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
            -{discount}%
          </span>
        ) : null}
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
          {product.category}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mb-2 font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            size={isOutOfStock ? "sm" : "icon"}
            variant="ghost"
            disabled={isOutOfStock}
            className={`h-8 ${isOutOfStock ? 'px-3 w-auto opacity-50 cursor-not-allowed' : 'w-8 hover:bg-primary hover:text-primary-foreground'} text-muted-foreground`}
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock) addItem(product);
            }}
          >
            {isOutOfStock ? <span className="text-xs">Sold Out</span> : <ShoppingCart className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
