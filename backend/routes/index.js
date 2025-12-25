import express from 'express';
import userRouter from './user.js';

const router = express.Router();

// all routers used are here
router.use('/user', userRouter);

export default router;