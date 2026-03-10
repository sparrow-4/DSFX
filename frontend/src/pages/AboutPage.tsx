import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Zap, Users, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '@/lib/api';

export default function AboutPage() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl"
          >
            About <span className="text-gradient-spark">{settings?.storeName || 'DSFX Store'}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            {settings?.aboutText || "We're the leading supplier of professional stage special effects equipment, serving the entertainment industry worldwide since 2015."}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {(settings?.stats || [
            { label: 'Customers', value: '5,000+' },
            { label: 'Countries', value: '40+' },
            { label: 'Years Experience', value: '10+' },
            { label: 'Products', value: '500+' },
          ]).map((stat, i) => {
            // Mapping labels to icons as a best effort
            const IconMap: Record<string, any> = {
              'Customers': Users,
              'Countries': Globe,
              'Years Experience': Award,
              'Experience': Award,
              'Products': Zap,
              'Projects': Zap,
            };
            const Icon = IconMap[stat.label] || Zap;

            return (
              <motion.div
                key={stat.label + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-display text-3xl font-bold text-foreground">
                Get in <span className="text-gradient-spark">Touch</span>
              </h2>
              <p className="mb-8 text-muted-foreground">
                Need help choosing the right equipment for your event? Our team of experts is ready to assist.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{settings?.email || 'info@dsfxstore.com'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{settings?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{settings?.location || 'Los Angeles, California'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4 rounded-lg border border-border bg-card p-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input className="w-full h-10 px-3 rounded-md border border-input bg-background" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full h-10 px-3 rounded-md border border-input bg-background" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <input className="w-full h-10 px-3 rounded-md border border-input bg-background" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea rows={5} className="w-full px-3 py-2 rounded-md border border-input bg-background" required />
              </div>
              <Button className="w-full bg-gradient-spark font-display">Send Message</Button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
