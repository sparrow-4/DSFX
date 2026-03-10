import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'DSFX Store',
    },
    aboutText: {
      type: String,
      default: "We're the leading supplier of professional stage special effects equipment, serving the entertainment industry worldwide since 2015.",
    },
    heroSubtitle: {
      type: String,
      default: "Premium pyrotechnics, CO2 jets, cold sparks, and flame effects for concerts, festivals, and live events that leave audiences breathless.",
    },
    stats: {
      type: [{ label: String, value: String }],
      default: [
        { value: '5,000+', label: 'Customers' },
        { value: '40+', label: 'Countries' },
        { value: '10+', label: 'Years Experience' },
        { value: '500+', label: 'Products' },
      ],
    },
    benefits: {
      type: [{ title: String, description: String, icon: String }],
      default: [
        { title: 'Free Shipping', description: 'On orders over ₹500', icon: 'Truck' },
        { title: 'Certified Safe', description: 'All products safety tested', icon: 'Shield' },
        { title: 'Expert Support', description: '24/7 technical assistance', icon: 'Zap' },
      ],
    },
    logoUrl: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'info@dsfxstore.com',
    },
    phone: {
      type: String,
      default: '+1 (555) 123-4567',
    },
    location: {
      type: String,
      default: 'Los Angeles, California',
    },
    facebookUrl: {
      type: String,
      default: '',
    },
    twitterUrl: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
