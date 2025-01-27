import { z } from 'zod';

const CreateValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    brand: z.string({
      required_error: 'Brand is required',
      invalid_type_error: 'Brand must be a string',
    }),
    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .min(0, {
        message: 'Price must be greater than or equal to 0',
      }),
    product_model: z.string({
      required_error: 'Product Model is required',
      invalid_type_error: 'Product Model must be a string',
    }),
    image: z
      .string({
        invalid_type_error: 'Image must be a string',
      })
      .url({
        message: 'Image must be a valid URL',
      })
      .optional(),
    category: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
      required_error: 'Category is required',
      invalid_type_error: 'Category must be a valid option',
    }),
    quantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .min(0, {
        message: 'Quantity must be greater than or equal to 0',
      }),
  }),
});

const CreateMultipleValidation = z.object({
  body: z.array(
    z.object({
      name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      }),
      brand: z.string({
        required_error: 'Brand is required',
        invalid_type_error: 'Brand must be a string',
      }),
      price: z
        .number({
          required_error: 'Price is required',
          invalid_type_error: 'Price must be a number',
        })
        .min(0, {
          message: 'Price must be greater than or equal to 0',
        }),
      product_model: z.string({
        required_error: 'Product Model is required',
        invalid_type_error: 'Product Model must be a string',
      }),
      image: z
        .string({
          invalid_type_error: 'Image must be a string',
        })
        .url({
          message: 'Image must be a valid URL',
        })
        .optional(),
      category: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
        required_error: 'Category is required',
        invalid_type_error: 'Category must be a valid option',
      }),
      quantity: z
        .number({
          required_error: 'Quantity is required',
          invalid_type_error: 'Quantity must be a number',
        })
        .min(0, {
          message: 'Quantity must be greater than or equal to 0',
        }),
    }),
  ),
});

const UpdateValidation = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be a string',
      })
      .optional(),
    brand: z
      .string({
        invalid_type_error: 'Brand must be a string',
      })
      .optional(),
    price: z
      .number({
        invalid_type_error: 'Price must be a number',
      })
      .min(0, {
        message: 'Price must be greater than or equal to 0',
      })
      .optional(),
    product_model: z
      .string({
        invalid_type_error: 'Product Model must be a string',
      })
      .optional(),
    image: z
      .string({
        invalid_type_error: 'Image must be a string',
      })
      .url({
        message: 'Image must be a valid URL',
      })
      .optional(),
    category: z
      .enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
        message:
          'Category must be one of Mountain, Road, Hybrid, BMX, Electric',
      })
      .optional(),
    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .optional(),
    quantity: z
      .number({
        invalid_type_error: 'Quantity must be a number',
      })
      .min(0, {
        message: 'Quantity must be greater than or equal to 0',
      })
      .optional(),
  }),
});

const ProductsValidation = {
  CreateValidation,
  CreateMultipleValidation,
  UpdateValidation,
};

export default ProductsValidation;
