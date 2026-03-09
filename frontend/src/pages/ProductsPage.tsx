import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, type ApiProduct } from '@/lib/api';

const CATEGORIES = [
  { id: '1', name: 'Spark Machines', slug: 'spark-machines' },
  { id: '2', name: 'CO2 Effects', slug: 'co2-effects' },
  { id: '3', name: 'Flame Effects', slug: 'flame-effects' },
  { id: '4', name: 'Fog & Haze', slug: 'fog-haze' },
  { id: '5', name: 'Confetti & Streamers', slug: 'confetti-streamers' },
  { id: '6', name: 'Pyrotechnics', slug: 'pyrotechnics' },
];

function apiProductToProduct(p: ApiProduct) {
  return {
    id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: p.images.length > 0 ? p.images : ['/placeholder.svg'],
    category: p.category,
    stockQuantity: p.stock,
    specifications: p.specifications,
    featured: p.featured,
    rating: p.rating,
    reviewCount: p.reviewCount,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  };
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const activeCategory = searchParams.get('category') || 'all';

  const { data: apiProducts, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const products = useMemo(() => (apiProducts || []).map(apiProductToProduct), [apiProducts]);

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === activeCategory
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, activeCategory, search]);

  const setCategory = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            All <span className="text-gradient-spark">Products</span>
          </h1>
          <p className="text-muted-foreground">Professional stage effects equipment</p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer font-display text-xs"
              onClick={() => setCategory('all')}
            >
              All
            </Badge>
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat.id}
                variant={activeCategory === cat.slug ? 'default' : 'outline'}
                className="cursor-pointer font-display text-xs"
                onClick={() => setCategory(cat.slug)}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-secondary/50" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="py-20 text-center">
            <p className="text-lg text-destructive">Failed to load products. Is the backend server running?</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && (
          filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
