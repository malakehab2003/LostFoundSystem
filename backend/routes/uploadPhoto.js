import express from "express";
import { upload } from "../utils/multer.js";
import { uploadImage } from "../controller/uploadPhotoController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

export default router;