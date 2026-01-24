import { Item } from "../models/db.js";
import { Op } from 'sequelize';


export const listItemsService = async (filters, page, limit) => {
    const {
        title,
        government,
        city,
        place,
        type,
        category_id,
        date_from,
        date_to,
    } = filters;

    const where = {};

    if (title) {
        where.title = { [Op.like]: `%${title}%` }
    }
    if (government) where.government = government;
    if (city) where.city = city;
    if (place) where.place = place;
    if (type) where.type = type;
    if (category_id) where.item_category_id = category_id;
    if (date_from || date_to) {
        where.date = {};
        if (date_from) where.date[Op.gte] = date_from;
        if (date_to) where.date[Op.lte] = date_to;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Item.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        }
    }
}

