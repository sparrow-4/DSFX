import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Not required to allow guest checkout if needed, but required for account features
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusTimeline: [
      {
        status: String,
        date: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

// Auto-add to timeline when status changes
orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus')) {
    if (!this.statusTimeline) {
      this.statusTimeline = [];
    }
    this.statusTimeline.push({ status: this.orderStatus, date: new Date() });
  }
  next();
});

export default mongoose.model('Order', orderSchema);
