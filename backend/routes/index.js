import express from 'express';
import userRouter from './user.js';
import addressRouter from './address.js';
import brandRouter from './brand.js';
import productCategoryRouter from './productCategory.js';
import itemCategoryRouter from './itemCategory.js';
import itemRouter from './item.js';
import productRouter from './product.js';

const router = express.Router();

// all routers used are here
router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/brand', brandRouter);
router.use('/product/category', productCategoryRouter);
router.use('/item/category', itemCategoryRouter);
router.use('/item', itemRouter);
router.use('/product', productRouter);

export default router;