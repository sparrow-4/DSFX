import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Check, Truck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchProduct } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { getImageUrl } from '@/lib/api';
import ReviewSection from '@/components/ReviewSection';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: apiProduct, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  const product = apiProduct
    ? {
      id: apiProduct._id,
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.price,
      originalPrice: apiProduct.originalPrice,
      images: apiProduct.images.length > 0 ? apiProduct.images : ['/placeholder.svg'],
      category: apiProduct.category,
      stockQuantity: apiProduct.stock,
      specifications: apiProduct.specifications,
      featured: apiProduct.featured,
      rating: apiProduct.rating,
      reviewCount: apiProduct.reviewCount,
      createdAt: new Date(apiProduct.createdAt),
      updatedAt: new Date(apiProduct.updatedAt),
    }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-xl bg-secondary/50" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-secondary/50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
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
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-secondary">
              <img
                src={getImageUrl(product.images[selectedImage])}
                alt={product.name}
                className="h-96 w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === i ? 'border-primary' : 'border-border'
                      }`}
                  >
                    <img src={getImageUrl(img)} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
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
                        className={`h-4 w-4 ${i < Math.round(product.rating!) ? 'fill-primary text-primary' : 'text-muted'
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
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
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
              Free shipping on orders over ₹500
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

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />

      </div>
    </div>
  );
}
