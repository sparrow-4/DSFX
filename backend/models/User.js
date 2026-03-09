import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Optional: because a user might register purely through Google Auth
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined if we add other auth methods later
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    // Adding address details for Feature 4 now
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
