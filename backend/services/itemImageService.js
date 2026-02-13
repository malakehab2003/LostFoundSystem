import { ItemImage, Item, User } from "../models/db.js";
import { validateImageUrl } from "../utils/validateData.js";
import { checkItemToUser } from "../utils/item.js";


export const addItemImageService = async (itemId, images_url) => {
    if (!itemId || !images_url || !Array.isArray(images_url)) throw new Error ("Missing image url or item id");

    images_url.forEach(url => {
        validateImageUrl(url);
    });

    const imageData = images_url.map(url => ({
        item_id: itemId,
        image_url: url,
    }));

    await ItemImage.bulkCreate(imageData);
}


export const validateUserReturnImageService = async (image_id, user_id) => {
    if (!image_id) throw new Error ("Missing image id");

    const image = await ItemImage.findByPk(image_id);

    if (!image) throw new Error ("Can't get image");
    
    const item = await Item.findByPk(image.item_id);
    
    checkItemToUser(item.user_id, user_id);
    
    return image;
}


export const validateItemAndAddImageService = async (item_id, images_url, user_id) => {
    const item = await Item.findByPk(item_id);

    if (!item) throw new Error ("Can't find item");

    checkItemToUser(item.user_id, user_id);

    await addItemImageService(item_id, images_url);
}
