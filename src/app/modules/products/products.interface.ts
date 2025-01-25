export interface ProductsInterface {
  name: string;
  brand: string;
  price: number;
  product_model: string;
  image: string;
  category: 'Mountain' | 'Road' | 'Hybrid' | 'BMX' | 'Electric';
  description: string;
  quantity: number;
  in_stock: boolean;
  is_deleted: boolean;
}
