import express from 'express';
import * as notificationController from '../controller/notificationController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', middleware.AuthRequest, notificationController.listNotifications);
router.post('/create', middleware.AuthRequest, middleware.roleAuth(["admin"]), notificationController.createNotification);

export default router;