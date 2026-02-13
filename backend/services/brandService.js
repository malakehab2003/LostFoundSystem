import { Brand } from "../models/db.js";
import * as brandUtils from '../utils/brand.js';


export const listBrandService = async () => {
    const brands = Brand.findAll();

    if (!brands) throw new Error ("Can't get brands");

    return brands;
}


export const createBrandService = async (name) => {
    const brand = Brand.create({
        name,
    });

    if (!brand) throw new Error ("Can't create brand");

    return brand;
}


export const updateBrandService = async (id, name) => {
    const brand = await brandUtils.getBrandById(id);

    if (!brand) throw new Error ("Can't get brand");

    brand.name = name;
    await brand.save();

    return brand;
}


export const deleteBrandService = async (id) => {
    const brand = await brandUtils.getBrandById(id);

    if (!brand) throw new Error ("Can't get brand");

    await brand.destroy();
}
