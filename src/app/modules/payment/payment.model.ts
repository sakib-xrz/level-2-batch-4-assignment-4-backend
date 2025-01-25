import mongoose from 'mongoose';
import { PaymentInterface } from './payment.interface';

const PaymentSchema = new mongoose.Schema<PaymentInterface>(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_gateway_data: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

export const Payment = mongoose.model('Payment', PaymentSchema);
