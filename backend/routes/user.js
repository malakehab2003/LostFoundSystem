import express from 'express';
import * as UserController from '../controller/userController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/createUser', UserController.createUser);
router.post('/login', UserController.login);
router.get('/getMe', middleware.AuthRequest, UserController.getMe);
router.put('/update', middleware.AuthRequest, UserController.update);
router.delete('/delete', middleware.AuthRequest, UserController.deleteUser);
router.put('/undoDelete', UserController.undoDelete);

export default router;