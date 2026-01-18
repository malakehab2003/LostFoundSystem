import express from 'express';
import * as ProductCategoryController from '../controller/productCategoryController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', ProductCategoryController.listProductCategory);
router.post('/create', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), ProductCategoryController.createProductCategory);
router.put('/update/:id', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), ProductCategoryController.updateProductCategory);
router.delete('/delete/:id', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), ProductCategoryController.deleteProductCategory)

export default router;