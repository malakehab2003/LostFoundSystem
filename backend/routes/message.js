import express from 'express';
import * as MessageController from '../controller/messageController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, MessageController.createMessage);
// router.delete('/delete/:id', middleware.AuthRequest, MessageController.deleteImage);

export default router;