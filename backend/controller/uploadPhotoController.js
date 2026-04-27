  import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadPhotos.js";

export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const uploads = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );

    res.status(200).json({
      message: "Images uploaded successfully",
      images: uploads,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id)
      return res.status(400).json({ message: "public_id required" });

    await deleteFromCloudinary(public_id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
