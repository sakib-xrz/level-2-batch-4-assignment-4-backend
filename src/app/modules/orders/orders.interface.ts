import { Types } from 'mongoose';

export interface OrdersInterface {
  customer: Types.ObjectId;
  phone: string;
  product: Types.ObjectId;
  quantity: number;
  delivery_address: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  transaction_id: string;
  sub_total: number;
  shipping_charge: number;
  grand_total: number;
  is_deleted: boolean;
}
