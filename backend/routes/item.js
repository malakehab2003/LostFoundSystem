import express from 'express';
import * as ItemController from '../controller/itemController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', ItemController.listItems);


export default router;