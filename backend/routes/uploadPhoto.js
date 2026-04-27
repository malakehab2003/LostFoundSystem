import express from "express";
import { upload } from "../utils/multer.js";
import * as Controller from "../controller/uploadPhotoController.js";
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// router.post("/upload", upload.array("images", 10), middleware.AuthRequest, Controller.uploadMultipleImages);
// router.delete("/delete", middleware.AuthRequest, Controller.deleteImage);

export default router;