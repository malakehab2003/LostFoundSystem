import * as service from '../services/brandService.js';


export const listBrand = async (req, res) => {
    try {
        const brands = await service.listBrandService();

        if (!brands) return res.status(400).send({ message: "Can't get brands" });

        return res.status(200).send({
            brands,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const createBrand = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).send({ error: "No name added" });

        const brand = await service.createBrandService(name);

        if (!brand) return res.status(400).send({ error: "Can't create brand" });

        return res.status(201).send({
            message: "Brand created successfully",
            brand,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name || !id) return res.status(400).send({ error: "Can't update brand" });

        const brand = await service.updateBrandService(id, name);

        return res.status(200).send({
            message: "Brand updated successfully",
            brand,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) return res.status(400).send({ error: "No id found" });

        await service.deleteBrandService(id);

        return res.status(200).send({
            message: "Brand deleted successfully",
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
