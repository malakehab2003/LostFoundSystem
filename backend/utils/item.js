import { Item, ItemCategory, ItemImage, User, Comment, City, Government } from '../models/db.js';
import { Op } from 'sequelize';

export const buildWhereFilters = (filters) => {
    const { title, government, city, place, type, category_id, date_from } = filters;
    const where = {};
    where[Op.and] = [];

    if (title) {
        where[Op.and].push({
            [Op.or]: [
                { title: { [Op.like]: `%${title}%` } },
                { description: { [Op.like]: `%${title}%` } }
            ]
        });
    }
    if (government) where.government = government;
    if (city) where.city = city;
    if (place) where.place = place;
    where.type = type;
    if (category_id) where.item_category_id = category_id;
    if (date_from) where.date = { [Op.gte]: new Date(date_from), [Op.lte]: new Date() };

    return where;
}


export const buildWhereForCategoryItems = (filters, items) => {
    let where = {};
    if (filters.category_id) {
        where = { item_category_id: filters.category_id };
        if (items.length > 0) {
            const matchedIds = items.map(item => item.id);
            where.id = { [Op.notIn]: matchedIds };
        }
    }

    return where;
}


export const getItems = async (where, limit, offset, order) => {
    return await Item.findAll({
        where,
        limit,
        offset,
        order,
        include: [
            {
                model: ItemCategory,
                as: 'category',
                attributes: ['id', 'name'],
            },
            {
                model: ItemImage,
                as: 'images',
                attributes: ['id', 'image_url'],
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name'],
            },
            {
                model: Government,
                as: 'government',
                attributes: ['id', 'name_en', 'name_ar']
            },
            {
                model: City,
                as: 'city',
                attributes: ['id', 'name_en', 'name_ar']
            },
            {
                model: Comment,
                as: 'comments',
                include: [
                    {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                    },
                ],
            },
        ],
    });
}


export const checkItemToUser = (id, user_id) => {
    if (id !== user_id) {
        throw new Error('This item not related to you');
    }
}
