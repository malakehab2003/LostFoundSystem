import { uploadToCloudinary } from "../utils/uploadPhotos.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = await uploadToCloudinary(req.file.buffer);

    return res.status(200).json({
      message: "Image uploaded successfully",
      url,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Upload failed",
      error: err.message,
    });
  }
};