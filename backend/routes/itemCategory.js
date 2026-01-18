import express from 'express';
import * as ItemCategoryController from '../controller/itemCategoryController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', ItemCategoryController.listItemCategory);
router.post('/create', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), ItemCategoryController.createItemCategory);
router.put('/update/:id', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), ItemCategoryController.updateItemCategory);
router.delete('/delete/:id', middleware.AuthRequest, middleware.roleAuth(['owner', 'manager']), ItemCategoryController.deleteItemCategory)

export default router;