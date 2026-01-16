import express from 'express';
import userRouter from './user.js';
import addressRouter from './address.js';
import brandRouter from './brand.js';

const router = express.Router();

// all routers used are here
router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/brand', brandRouter);

export default router;