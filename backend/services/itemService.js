import * as utils from '../utils/item.js';
import * as validate from '../utils/validateData.js';
import { Item, User, Image } from '../models/db.js';
import { uploadToCloudinary } from '../utils/uploadPhotos.js';


export const listItemsService = async (filters, page, limit) => {
    validate.validateType(filters.type);

    const offset = (page - 1) * limit;
    let arrange = filters.date_from ? 'ASC' : 'DESC';

    const where = utils.buildWhereFilters(filters);
    const items = await utils.getItems(where, limit, offset, [['created_at', arrange]]);
    let count = await utils.countItems(where);

    let categoryItems = [];
    if (filters.category_id) {
        const whereOfCategoryItems = utils.buildWhereForCategoryItems(filters, items);
        categoryItems = await utils.getItems(whereOfCategoryItems, limit, offset, [['created_at', arrange]]);
        count += await utils.countItems(whereOfCategoryItems);
    }

    const allItems = [...items, ...categoryItems];

    return {
        allItems,
        pagination: {
            total: allItems.length,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        }
    };
}


export const getItemService = async (id) => {
    const item = await utils.getItems({id,}, 1, 0, [['created_at', 'DESC']]);

    return item;
}


export const createItemService = async (data, files) => {
    const item = await Item.create({
        ...data,
    });

    if (files && files.length > 0) {
        const uploadedImages = await Promise.all(
            files.map(file => uploadToCloudinary(file.buffer))
        );

        const imagesToCreate = uploadedImages.map(img => ({
            url: img.url,
            public_id: img.public_id,
            owner_id: item.id,
            owner_type: "item",
        }));

        await Image.bulkCreate(imagesToCreate);
    }

    return item
}


export const updateItemService = async (data) => {
    const item = await Item.findByPk(data.id);
    if (!item) {
        throw new Error('Item not found');
    }

    utils.checkItemToUser(item.user_id, data.user_id);

    if (!data.government_id && !item.government_id) delete data.city_id;

    await item.update(data);

    return item
}


export const deleteItemService = async (id, user_id) => {
    const item = await Item.findByPk(id);
    
    utils.checkItemToUser(item.user_id, user_id);

    if (!item) throw new Error('Item not found');

    await item.destroy();
}


export const getItemOwnerService = async (item_id) => {
    const item = await Item.findByPk(item_id);

    if (!item) throw new Error('Item not found');

    const user = await User.findByPk(item.user_id);

    if (!user) throw new Error('User not found');

    return user;
}
