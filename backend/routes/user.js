import express from 'express';
import * as UserController from '../controller/userController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/createUser', UserController.createUser);
router.get('/getMe', middleware.AuthRequest, UserController.getMe);

export default router;