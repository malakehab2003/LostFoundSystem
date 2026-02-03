import * as service from '../services/itemImageService.js';


export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id || !user) return res.status(400).send({ err: "Missing id", });
        
        const image = await service.validateUserReturnImageService(id, user.id);
        
        if (!image) return res.status(400).send({ err: "Can't get image", });
        
        await image.destroy();
        
        return res.status(200).send({ message: "Image Deleted Successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const addImages = async (req, res) => {
    try {
        const { item_id, images_url } = req.body;
        const user = req.user;
        
        if (!item_id || !images_url || !user) return res.status(400).send({ err: "Missing data", });
        
        await service.validateItemAndAddImageService(item_id, images_url, user.id);
        
        return res.status(200).send({ message: "Images Added Successfully" });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
