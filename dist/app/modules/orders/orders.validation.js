"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersValidation = void 0;
const zod_1 = require("zod");
const CreateValidation = zod_1.z.object({
    body: zod_1.z.object({
        customer: zod_1.z.string({
            required_error: 'Customer ID is required',
            invalid_type_error: 'Customer ID must be a string',
        }),
        phone: zod_1.z
            .string({
            required_error: 'Phone is required',
            invalid_type_error: 'Phone must be a string',
        })
            .regex(/^\+?[0-9]{10,15}$/, {
            message: 'Phone number must be between 10-15 digits',
        }),
        product: zod_1.z.string({
            required_error: 'Product ID is required',
            invalid_type_error: 'Product ID must be a string',
        }),
        quantity: zod_1.z
            .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
        })
            .min(1, {
            message: 'Quantity must be at least 1',
        }),
        delivery_address: zod_1.z
            .string({
            required_error: 'Delivery address is required',
            invalid_type_error: 'Delivery address must be a string',
        })
            .min(5, {
            message: 'Delivery address must be at least 5 characters long',
        }),
    }),
});
exports.OrdersValidation = { CreateValidation };
