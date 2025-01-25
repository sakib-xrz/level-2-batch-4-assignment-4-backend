import { Types } from 'mongoose';

export interface OrdersInterface {
  customer: Types.ObjectId;
  phone: string;
  product: Types.ObjectId;
  quantity: number;
  delivery_address: string;
  payment_method: 'CASH_ON_DELIVERY' | 'SSL_COMMERZ';
  sub_total: number;
  shipping_charge: number;
  grand_total: number;
}
