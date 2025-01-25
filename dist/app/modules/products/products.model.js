"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProductsSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    product_model: { type: String, required: true },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dl5rlskcv/image/upload/v1735927164/default-product_o9po6f.jpg',
    },
    category: {
        type: String,
        enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
        required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    in_stock: { type: Boolean },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
// Middleware to manage `in_stock` before saving
ProductsSchema.pre('save', function (next) {
    this.in_stock = this.quantity > 0;
    next();
});
// Middleware to manage `in_stock` before saving for multiple documents using `insertMany`
ProductsSchema.pre('insertMany', function (next, docs) {
    if (Array.isArray(docs)) {
        docs.forEach((doc) => {
            doc.in_stock = doc.quantity > 0;
        });
    }
    next();
});
// Middleware for update queries to manage `in_stock`
ProductsSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.quantity !== undefined) {
        update.in_stock = update.quantity > 0;
    }
    next();
});
exports.Product = mongoose_1.default.model('Products', ProductsSchema);
