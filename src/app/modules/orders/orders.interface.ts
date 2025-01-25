import { Types } from 'mongoose';

export interface OrdersInterface {
  customer: Types.ObjectId;
  phone: string;
  product: Types.ObjectId;
  quantity: number;
  delivery_address: string;
  payment_method: 'CASH_ON_DELIVERY' | 'SSL_COMMERZ';
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  transaction_id: string;
  sub_total: number;
  shipping_charge: number;
  grand_total: number;
  is_deleted: boolean;
}
