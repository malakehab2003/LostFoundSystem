import express from 'express';
import * as BrandController from '../controller/brandController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', BrandController.listBrand);
router.post('/create', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), BrandController.createBrand);
router.put('/update/:id', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), BrandController.updateBrand);
router.delete('/delete/:id', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), BrandController.deleteBrand);

export default router;