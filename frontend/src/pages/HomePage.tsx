
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';
import type { ApiProduct } from '@/lib/api';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchSettings } from '@/lib/api';


export default function HomePage() {
  function apiProductToProduct(p: ApiProduct): Product {
    return {
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      images: p.images?.length ? p.images : ['/placeholder.svg'],
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

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings
  });

  const featured = products
    .filter((p) => p.featured)
    .slice(0, 4)
    .map(apiProductToProduct);

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">

        <div className="absolute inset-0 bg-gradient-stage" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--spark)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--ember)/0.1),transparent_60%)]" />

        <div className="container relative mx-auto px-4 py-24">
          <div className="max-w-3xl">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Zap className="h-3 w-3" /> Professional Stage SFX
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6 font-display text-5xl font-black leading-tight tracking-tight text-foreground md:text-7xl"
            >
              Express Your <span className="text-gradient-spark">{settings?.storeName?.split(' ')[0] || 'Stage'}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-8 max-w-xl text-lg text-muted-foreground"
            >
              {settings?.heroSubtitle || 'Premium pyrotechnics, CO2 jets, cold sparks, and flame effects for concerts, festivals, and live events that leave audiences breathless.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-gradient-spark font-display" asChild>
                <Link to="/products">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="font-display" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </motion.div>

          </div>
        </div>

        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-ember/5 blur-3xl" />

      </section>

      {/* Trust Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">

          {(settings?.benefits || [
            { icon: 'Truck', title: 'Free Shipping', description: 'On orders over ₹500' },
            { icon: 'Shield', title: 'Certified Safe', description: 'All products safety tested' },
            { icon: 'Zap', title: 'Expert Support', description: '24/7 technical assistance' },
          ]).map((item, i) => {
            const Icon = { Truck, Shield, Zap }[item.icon] || Zap;
            return (
              <motion.div
                key={item.title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              Featured <span className="text-gradient-spark">Equipment</span>
            </h2>

            <p className="mx-auto max-w-lg text-muted-foreground">
              Top-rated stage effects trusted by professionals worldwide
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {featured.map((product, i) => (

              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >

                <ProductCard product={product} />

              </motion.div>

            ))}

          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="font-display" asChild>
              <Link to="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
}

