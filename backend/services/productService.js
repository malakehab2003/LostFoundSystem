import * as utils from '../utils/product.js';


export const listItemsService = async (filters, page, limit) => {
    const offset = (page - 1) * limit;
    const where = utils.buildWhereFilters(filters);
    
    const products = await utils.getProducts(where, limit, offset);

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


export const getProductService = async (id) => {
    if (!id) throw new Error ("Missing id");
    const where = { id, }

    const product = await utils.getProducts(where, 1, 0);

    if (!product) throw new Error ("Product not found");

    return product.rows[0];
}