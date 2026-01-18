import { ItemCategory } from "../models/db.js";

export const getItemCategoryById = async (id) => {
    if (!id) throw new Error ("No id passed");

    const category = ItemCategory.findOne({
        where: {id},
    });

    if (!category) throw new Error ("Can't find category");

    return category
}