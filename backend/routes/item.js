import express from 'express';
import * as ItemController from '../controller/itemController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', ItemController.listItems);
router.get('/getItem/:id', ItemController.getItem);
router.get('/getMyItems', middleware.AuthRequest, ItemController.getMyItems);
router.post('/create', middleware.AuthRequest, ItemController.createItem);
router.put('/update/:id', middleware.AuthRequest, ItemController.updateItem);
router.delete('/delete/:id', middleware.AuthRequest, ItemController.deleteItem);

export default router;