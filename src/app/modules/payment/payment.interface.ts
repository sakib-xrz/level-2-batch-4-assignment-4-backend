import { Types } from 'mongoose';

export interface PaymentInterface {
  order_id: Types.ObjectId;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transaction_id: string;
  amount: number;
  payment_gateway_data?: Record<string, unknown>;
}
