import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
categorySchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  }
  next();
});

export default mongoose.model('Category', categorySchema);
