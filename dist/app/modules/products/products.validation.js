"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const CreateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        }),
        brand: zod_1.z.string({
            required_error: 'Brand is required',
            invalid_type_error: 'Brand must be a string',
        }),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
            .min(0, {
            message: 'Price must be greater than or equal to 0',
        }),
        product_model: zod_1.z.string({
            required_error: 'Product Model is required',
            invalid_type_error: 'Product Model must be a string',
        }),
        image: zod_1.z
            .string({
            invalid_type_error: 'Image must be a string',
        })
            .url({
            message: 'Image must be a valid URL',
        })
            .optional(),
        category: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
            required_error: 'Category is required',
            invalid_type_error: 'Category must be a valid option',
        }),
        quantity: zod_1.z
            .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
        })
            .min(0, {
            message: 'Quantity must be greater than or equal to 0',
        }),
    }),
});
const CreateMultipleValidation = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        }),
        brand: zod_1.z.string({
            required_error: 'Brand is required',
            invalid_type_error: 'Brand must be a string',
        }),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
            .min(0, {
            message: 'Price must be greater than or equal to 0',
        }),
        product_model: zod_1.z.string({
            required_error: 'Product Model is required',
            invalid_type_error: 'Product Model must be a string',
        }),
        image: zod_1.z
            .string({
            invalid_type_error: 'Image must be a string',
        })
            .url({
            message: 'Image must be a valid URL',
        })
            .optional(),
        category: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
            required_error: 'Category is required',
            invalid_type_error: 'Category must be a valid option',
        }),
        quantity: zod_1.z
            .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
        })
            .min(0, {
            message: 'Quantity must be greater than or equal to 0',
        }),
    })),
});
const UpdateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            invalid_type_error: 'Name must be a string',
        })
            .optional(),
        brand: zod_1.z
            .string({
            invalid_type_error: 'Brand must be a string',
        })
            .optional(),
        price: zod_1.z
            .number({
            invalid_type_error: 'Price must be a number',
        })
            .min(0, {
            message: 'Price must be greater than or equal to 0',
        })
            .optional(),
        product_model: zod_1.z
            .string({
            invalid_type_error: 'Product Model must be a string',
        })
            .optional(),
        image: zod_1.z
            .string({
            invalid_type_error: 'Image must be a string',
        })
            .url({
            message: 'Image must be a valid URL',
        })
            .optional(),
        category: zod_1.z
            .enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
            message: 'Category must be one of Mountain, Road, Hybrid, BMX, Electric',
        })
            .optional(),
        description: zod_1.z
            .string({
            invalid_type_error: 'Description must be a string',
        })
            .optional(),
        quantity: zod_1.z
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
exports.default = ProductsValidation;
