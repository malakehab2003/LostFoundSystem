import * as service from '../services/itemService.js';
import * as validate from '../utils/validateData.js';
import { addItemImageService } from '../services/itemImageService.js';
import { getItems } from '../utils/item.js';


const DEFAULT_LIMIT = 10;

export const listItems = async (req, res) => {
    try {
        const {
            page = 1,
            ...filters
        } = req.query

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const pageSize = DEFAULT_LIMIT;

        const { allItems, pagination } = await service.listItemsService(filters, pageNumber, pageSize);


        return res.status(200).send({
            allItems,
            pagination,
        });

    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const getItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ err: 'No id' });

        const item = await service.getItemService(id);

        if (!item) return res.status(400).send({ err: "Can't get item" });

        return res.status(200).send({ item: item[0], });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const createItem = async (req, res) => {
    try {
        const user = req.user;
        const { category_id, images_url, ...rest } = req.body;

        const data = {
        ...rest,
        item_category_id: category_id,
        user_id: user.id
        };

        if (
            !data.title ||
            !data.place ||
            !data.item_category_id ||
            !data.date ||
            !data.type
        ) return res.status(400).send({ err: "Missing required fields" });

        await validate.validateItemData(data.government_id, data.item_category_id, data.city_id, data.type, data.date);

        if (!data.government_id) delete data.city_id;

        const item = await service.createItemService(data);

        if (!item) return res.status(400).send({ err: "Can't create item" });

        if (images_url) await addItemImageService(item.id, images_url);

        return res.status(201).send({
            message: "Item created Successfully",
            item,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const updateItem = async (req, res) => {
    try {
        const user = req.user;
        const { category_id, ...rest } = req.body;
        const { id } = req.params;
        
        validate.validateId(id);

        const data = {
            ...rest,
            item_category_id: category_id,
            user_id: user.id,
            id,
        };

        await validate.validateItemData(data.government_id, data.item_category_id, data.city_id, data.type, data.date);

        const item = await service.updateItemService(data);

        if (!item) return res.status(400).send({ err: "Can't update item" });

        return res.status(200).send({
            message: "Item updated Successfully",
            item,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) return res.status(400).send({ err: "Missing id" });

        await service.deleteItemService(id, user.id);

        return res.status(200).send({
            message: "Item deleted Successfully",
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const getMyItems = async (req, res) => {
    try {
        const user= req.user;
        const where = { user_id: user.id }

        const items = await getItems(where, null, 0, [['created_at', 'DESC']]);

        return res.status(200).send({ items, })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
