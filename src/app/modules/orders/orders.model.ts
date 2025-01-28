import mongoose, { Schema } from 'mongoose';
import { OrdersInterface } from './orders.interface';

const OrdersSchema = new mongoose.Schema<OrdersInterface>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    phone: { type: String, required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    quantity: { type: Number, required: true },
    delivery_address: { type: String, required: true },
    payment_status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    transaction_id: { type: String, unique: true, required: true },
    sub_total: { type: Number, required: true },
    shipping_charge: { type: Number, required: true },
    grand_total: { type: Number, required: true },
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

export const Orders = mongoose.model('Orders', OrdersSchema);
