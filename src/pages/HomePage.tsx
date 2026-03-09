import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, categories } from '@/data/products';

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        {/* Background gradient */}
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
              Ignite Your{' '}
              <span className="text-gradient-spark">Stage</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-8 max-w-xl text-lg text-muted-foreground"
            >
              Premium pyrotechnics, CO2 jets, cold sparks, and flame effects for concerts, festivals, and live events that leave audiences breathless.
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

        {/* Decorative sparks */}
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-ember/5 blur-3xl" />
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $500' },
            { icon: Shield, title: 'Certified Safe', desc: 'All products safety tested' },
            { icon: Zap, title: 'Expert Support', desc: '24/7 technical assistance' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
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

      {/* Categories */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              Shop by <span className="text-gradient-spark">Category</span>
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-spark"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 px-8 py-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--spark)/0.1),transparent_70%)]" />
            <div className="relative">
              <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Ready to Elevate Your Show?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Get expert advice on the perfect SFX setup for your venue and events.
              </p>
              <Button size="lg" className="bg-gradient-spark font-display" asChild>
                <Link to="/about">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
