import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">
                DSFX<span className="text-primary">Store</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional stage special effects equipment for unforgettable live events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Shop</h4>
            <ul className="space-y-2">
              {['Spark Machines', 'CO2 Effects', 'Flame Effects', 'Pyrotechnics', 'Fog & Haze'].map((cat) => (
                <li key={cat}>
                  <Link to="/products" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/about' },
                { name: 'Shipping', path: '/about' },
                { name: 'Returns', path: '/about' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" /> info@dsfxstore.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Los Angeles, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DSFX Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
