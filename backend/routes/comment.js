import express from 'express';
import * as CommentController from '../controller/commentController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/addComment', middleware.AuthRequest, CommentController.addComment);
router.delete('/delete/:id', middleware.AuthRequest, CommentController.deleteComment);
router.put('/update/:id', middleware.AuthRequest, CommentController.updateComment);

export default router;