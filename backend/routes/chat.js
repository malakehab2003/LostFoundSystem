import express from 'express';
import * as ChatController from '../controller/chatController.js';
import * as middleware from '../utils/middlewares.js';


const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, ChatController.createChat);
router.get('/', middleware.AuthRequest, ChatController.getChat);

export default router;