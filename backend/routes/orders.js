import express from 'express';
import * as OrderController from '../controller/orderController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, OrderController.createOrder);
// router.get('/list', middleware.AuthRequest, OrderController.listOrders);
// router.get('/getOrder/:id', middleware.AuthRequest, OrderController.getOrder);
// router.put('/update/:id', middleware.AuthRequest, middleware.roleAuth([admin]), OrderController.updateOrder);
export default router;