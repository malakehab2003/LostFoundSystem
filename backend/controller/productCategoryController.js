import * as service from '../services/productCategoryService.js';


export const listProductCategory = async (req, res) => {
    try {
        const categorys = await service.listProductCategoryService();

        if (!categorys) return res.status(400).send({ message: "Can't get categorys" });

        return res.status(200).send({
            categorys,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const createProductCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).send({ error: "No name added" });

        const category = await service.createProductCategoryService(name);

        if (!category) return res.status(400).send({ error: "Can't create category" });

        return res.status(201).send({
            message: "ProductCategory created successfully",
            category,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const updateProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name || !id) return res.status(400).send({ error: "Can't update category" });

        const category = await service.updateProductCategoryService(id, name);

        return res.status(200).send({
            message: "ProductCategory updated successfully",
            category,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const deleteProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) return res.status(400).send({ error: "No id found" });

        await service.deleteProductCategoryService(id);

        return res.status(200).send({
            message: "ProductCategory deleted successfully",
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
