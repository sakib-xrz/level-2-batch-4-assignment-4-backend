"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentSchema = new mongoose_1.default.Schema({
    order_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
    },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING',
    },
    transaction_id: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    payment_gateway_data: {
        type: mongoose_1.default.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
});
exports.Payment = mongoose_1.default.model('Payment', PaymentSchema);
