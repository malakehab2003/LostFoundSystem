import * as utils from '../utils/item.js';
import * as validate from '../utils/validateData.js';
import { Item } from '../models/db.js';


export const listItemsService = async (filters, page, limit) => {
    validate.validateType(filters.type);

    const offset = (page - 1) * limit;
    let arrange = filters.date_from ? 'ASC' : 'DESC';

    const where = utils.buildWhereFilters(filters);
    const items = await utils.getItems(where, limit, offset, [['created_at', arrange]]);

    let categoryItems = [];
    if (filters.category_id) {
        const whereOfCategoryItems = utils.buildWhereForCategoryItems(filters, items);
        categoryItems = await utils.getItems(whereOfCategoryItems, limit, offset, [['created_at', arrange]]);
    }

    const allItems = [...items, ...categoryItems];

    return {
        allItems,
        pagination: {
            total: allItems.length,
            page,
            limit,
            totalPages: Math.ceil(allItems.length / limit),
        }
    };
}


export const getItemService = async (id) => {
    const item = await utils.getItems({id,}, 1, 0, [['created_at', 'DESC']]);

    return item;
}


export const createItemService = async (data) => {
    const item = await Item.create({
        ...data,
    });

    return item
}
