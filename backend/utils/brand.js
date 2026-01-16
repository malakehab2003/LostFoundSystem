import { Brand } from "../models/db.js";

export const getBrandById = async (id) => {
    if (!id) throw new Error ("No id passed");

    const brand = Brand.findOne({
        where: {id},
    });

    if (!brand) throw new Error ("Can't find brand");

    return brand
}