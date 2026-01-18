import { ItemCategory } from "../models/db.js";
import * as categoryUtils from '../utils/itemCategory.js';


export const listItemCategoryService = async () => {
    const categorys = ItemCategory.findAll();

    if (!categorys) throw new Error ("Can't get categorys");

    return categorys;
}


export const createItemCategoryService = async (name) => {
    const category = ItemCategory.create({
        name,
    });

    if (!category) throw new Error ("Can't create category");

    return category;
}


export const updateItemCategoryService = async (id, name) => {
    const category = await categoryUtils.getItemCategoryById(id);

    if (!category) throw new Error ("Can't get category");

    category.name = name;
    await category.save();

    return category;
}


export const deleteItemCategoryService = async (id) => {
    const category = await categoryUtils.getItemCategoryById(id);

    if (!category) throw new Error ("Can't get category");

    await category.destroy();
}
