import express from 'express';
import * as ProductImageController from '../controller/productImageController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.delete('/delete/:id', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager', 'staff']), ProductImageController.deleteImage);
router.post('/addImage', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager', 'staff']),  ProductImageController.addImages);

export default router;