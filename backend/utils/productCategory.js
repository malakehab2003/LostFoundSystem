import { ProductCategory } from "../models/db.js";

export const getProductCategoryById = async (id) => {
    if (!id) throw new Error ("No id passed");

    const category = ProductCategory.findOne({
        where: {id},
    });

    if (!category) throw new Error ("Can't find category");

    return category
}