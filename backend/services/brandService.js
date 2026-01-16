import { Brand } from "../models/db.js"


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
