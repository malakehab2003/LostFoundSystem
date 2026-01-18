import { ProductCategory } from "../models/db.js";
import * as categoryUtils from '../utils/productCategory.js';


export const listProductCategoryService = async () => {
    const categorys = ProductCategory.findAll();

    if (!categorys) throw new Error ("Can't get categorys");

    return categorys;
}


export const createProductCategoryService = async (name) => {
    const category = ProductCategory.create({
        name,
    });

    if (!category) throw new Error ("Can't create category");

    return category;
}


export const updateProductCategoryService = async (id, name) => {
    const category = await categoryUtils.getProductCategoryById(id);

    if (!category) throw new Error ("Can't get category");

    category.name = name;
    await category.save();

    return category;
}


export const deleteProductCategoryService = async (id) => {
    const category = await categoryUtils.getProductCategoryById(id);

    if (!category) throw new Error ("Can't get category");

    await category.destroy();
}
