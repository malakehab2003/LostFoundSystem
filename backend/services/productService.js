import * as utils from '../utils/product.js';
import { Product, ProductImage, ProductCategory, Brand, Review, User } from '../models/db.js';


export const listItemsService = async (filters, page, limit) => {
    const offset = (page - 1) * limit;
    const where = utils.buildWhereFilters(filters);
    
    const products = await Product.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        include: [
            {
                model: ProductCategory,
                as: 'category',
                attributes: ['id', 'name'],
            },
            {
                model: ProductImage,
                as: 'image',
                attributes: ['id', 'image_url'],
            },
            {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name'],
            },
            {
                model: Review,
                as: 'review',
                attributes: ['rate', 'message', 'image_url'],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ["id", 'name'],
                    }
                ]
            },
        ]
    });

    return {
        products,
        pagination: {
            total: products.length,
            page,
            limit,
            totalPages: Math.ceil(products.length / limit),
        }
    }
}