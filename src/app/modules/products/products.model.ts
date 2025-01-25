import mongoose, { Document } from 'mongoose';
import { ProductsInterface } from './products.interface';

interface ProductDocument extends Document, ProductsInterface {
  updateStockStatus(): Promise<void>;
}

const ProductsSchema = new mongoose.Schema<ProductsInterface>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    product_model: { type: String, required: true },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dl5rlskcv/image/upload/v1735927164/default-product_o9po6f.jpg',
    },
    category: {
      type: String,
      enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    in_stock: { type: Boolean },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

// Middleware to manage `in_stock` before saving
ProductsSchema.pre<ProductDocument>('save', function (next) {
  this.in_stock = this.quantity > 0;
  next();
});

// Middleware to manage `in_stock` before saving for multiple documents using `insertMany`
ProductsSchema.pre('insertMany', function (next, docs) {
  if (Array.isArray(docs)) {
    docs.forEach((doc) => {
      doc.in_stock = doc.quantity > 0;
    });
  }
  next();
});

// Middleware for update queries to manage `in_stock`
ProductsSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as Partial<ProductsInterface>;
  if (update.quantity !== undefined) {
    update.in_stock = update.quantity > 0;
  }
  next();
});

export const Product = mongoose.model('Products', ProductsSchema);
