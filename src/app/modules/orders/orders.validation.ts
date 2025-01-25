import { z } from 'zod';

const CreateValidation = z.object({
  body: z.object({
    customer: z.string({
      required_error: 'Customer ID is required',
      invalid_type_error: 'Customer ID must be a string',
    }),
    phone: z
      .string({
        required_error: 'Phone is required',
        invalid_type_error: 'Phone must be a string',
      })
      .regex(/^\+?[0-9]{10,15}$/, {
        message: 'Phone number must be between 10-15 digits',
      }),
    product: z.string({
      required_error: 'Product ID is required',
      invalid_type_error: 'Product ID must be a string',
    }),
    quantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .min(1, {
        message: 'Quantity must be at least 1',
      }),
    delivery_address: z
      .string({
        required_error: 'Delivery address is required',
        invalid_type_error: 'Delivery address must be a string',
      })
      .min(5, {
        message: 'Delivery address must be at least 5 characters long',
      }),
  }),
});

export const OrdersValidation = { CreateValidation };
