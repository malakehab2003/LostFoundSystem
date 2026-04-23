import express from 'express';
import userRouter from './user.js';
import addressRouter from './address.js';
import brandRouter from './brand.js';
import productCategoryRouter from './productCategory.js';
import itemCategoryRouter from './itemCategory.js';
import itemRouter from './item.js';
import productRouter from './product.js';
import itemImageRouter from './itemImage.js';
import productImageRouter from './productImage.js';
import governmentRouter from './government.js';
import cityRouter from './city.js';
import commentRouter from './comment.js';
import cartRouter from './cart.js';
import wishlistRouter from './wishlist.js';
import orderRouter from './orders.js';
import orderItemRouter from './orderItems.js';
import notificationRouter from './notifications.js';
import reviewRouter from './review.js';
import chatRouter from './chat.js';
import messageRouter from './message.js';
import promocodeRouter from './promocode.js';
import dashboardRouter from './dashboard.js';
import stripeRouter from './stipe.js';
import uploadPhotoRouter from './uploadPhoto.js'

const router = express.Router();

// all routers used are here
router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/brand', brandRouter);
router.use('/product/category', productCategoryRouter);
router.use('/item/category', itemCategoryRouter);
router.use('/item', itemRouter);
router.use('/product', productRouter);
router.use('/item/image/', itemImageRouter);
router.use('/product/image/', productImageRouter);
router.use('/government', governmentRouter);
router.use('/city', cityRouter);
router.use('/comment', commentRouter);
router.use('/cart', cartRouter);
router.use('/wishlist', wishlistRouter);
router.use('/order', orderRouter);
router.use('/order/item', orderItemRouter);
router.use('/notification', notificationRouter);
router.use('/review', reviewRouter);
router.use('/chat', chatRouter);
router.use('/message', messageRouter);
router.use('/promocode', promocodeRouter);
router.use('/dashboard', dashboardRouter);
router.use('/payment', stripeRouter);
router.use('/photo', uploadPhotoRouter);

export default router;