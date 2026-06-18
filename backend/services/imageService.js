import { Image, Item, Product } from "../models/db.js";
import { uploadToCloudinary } from "../utils/uploadPhotos.js";


export const addImagesService = async (owner_id, owner_type, files) => {
    if (!files || files.length === 0) throw new Error ("No images uploaded");

    await validateOwnerExists(owner_id, owner_type);

    const currentImagesCount = await Image.count({
        where: {
            owner_id,
            owner_type,
        },
    });

    const remainingSlots = 10 - currentImagesCount;

    if (remainingSlots <= 0) {
        throw new Error("Maximum number of images (10) already reached");
    }

    if (files.length > remainingSlots) {
        throw new Error(
            `You can upload only ${remainingSlots} more image(s)`
        );
    }

    const uploadedImages = await Promise.all(
        files.map(file => uploadToCloudinary(file.buffer))
    );

    const imagesToCreate = uploadedImages.map(img => ({
        url: img.url,
        public_id: img.public_id,
        owner_id,
        owner_type,
    }));

    await Image.bulkCreate(imagesToCreate);
}


export const getImageService = async (image_id) => {
    if (!image_id) throw new Error ("Missing image id");

    const image = await Image.findByPk(image_id);
    if (!image) throw new Error ("Can't get image");

    return image;
}

export const validateOwnerExists = async (owner_id, owner_type) => {
    if (!owner_id || !owner_type)
        throw new Error("Missing owner data");

    switch (owner_type) {
        case "item": {
            const item = await Item.findByPk(owner_id);
            if (!item || item.type === "found") throw new Error("Item not found or type found");
            return item;
        }

        case "product": {
            const product = await Product.findByPk(owner_id);
            if (!product) throw new Error("Product not found");
            return product;
        }

        default:
            throw new Error("Invalid owner type");
    }
};
