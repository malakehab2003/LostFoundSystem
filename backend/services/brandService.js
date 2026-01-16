import { Brand } from "../models/db.js"


export const listBrandService = async () => {
    const brands = Brand.findAll();

    if (!brands) throw new Error ("Can't get brands");

    return brands;
}
