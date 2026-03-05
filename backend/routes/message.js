import express from 'express';
import * as MessageController from '../controller/messageController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, MessageController.createMessage);
router.get('/list/:chat_id', middleware.AuthRequest, MessageController.getMessages);

export default router;