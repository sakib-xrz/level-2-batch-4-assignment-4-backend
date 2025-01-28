"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const orders_validation_1 = require("./orders.validation");
const orders_controller_1 = require("./orders.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)('CUSTOMER', 'ADMIN'), (0, validateRequest_1.default)(orders_validation_1.OrdersValidation.CreateValidation), orders_controller_1.OrdersController.createOrder)
    .get((0, auth_1.default)('ADMIN'), orders_controller_1.OrdersController.getAllOrders);
router.get('/my-orders', (0, auth_1.default)('CUSTOMER', 'ADMIN'), orders_controller_1.OrdersController.getMyOrders);
router.patch('/:order_id/status', (0, auth_1.default)('ADMIN'), orders_controller_1.OrdersController.chnageOrderStatus);
router.delete('/:order_id', (0, auth_1.default)('ADMIN'), orders_controller_1.OrdersController.deleteOrder);
exports.OrdersRoutes = router;
