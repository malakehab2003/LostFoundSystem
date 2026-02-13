import * as service from '../services/itemCategoryService.js';


export const listItemCategory = async (req, res) => {
    try {
        const categorys = await service.listItemCategoryService();

        if (!categorys) return res.status(400).send({ message: "Can't get categorys" });

        return res.status(200).send({
            categorys,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const createItemCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).send({ error: "No name added" });

        const category = await service.createItemCategoryService(name);

        if (!category) return res.status(400).send({ error: "Can't create category" });

        return res.status(201).send({
            message: "ItemCategory created successfully",
            category,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const updateItemCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name || !id) return res.status(400).send({ error: "Can't update category" });

        const category = await service.updateItemCategoryService(id, name);

        return res.status(200).send({
            message: "ItemCategory updated successfully",
            category,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const deleteItemCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) return res.status(400).send({ error: "No id found" });

        await service.deleteItemCategoryService(id);

        return res.status(200).send({
            message: "ItemCategory deleted successfully",
        });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
