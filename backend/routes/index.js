import express from 'express';
import userRouter from './user.js';
import addressRouter from './address.js';

const router = express.Router();

// all routers used are here
router.use('/user', userRouter);
router.use('/address', addressRouter);

export default router;