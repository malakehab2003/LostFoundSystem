import express from 'express';
import userRouter from './user.js';
import addressRouter from './address.js';
import brandRouter from './brand.js';
import productCategoryRouter from './product_category.js';

const router = express.Router();

// all routers used are here
router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/brand', brandRouter);
router.use('/productCategory', productCategoryRouter);

export default router;