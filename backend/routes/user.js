import express from 'express';
import * as UserController from '../controller/userController.js';

const router = express.Router();

// all routers used are here
router.post('/createUser', UserController.createUser);

export default router;