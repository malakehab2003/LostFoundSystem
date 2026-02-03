import express from 'express';
import * as ItemImageController from '../controller/itemImageController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.delete('/delete/:id', middleware.AuthRequest, ItemImageController.deleteImage);
router.post('/addImage', middleware.AuthRequest, ItemImageController.addImages);

export default router;