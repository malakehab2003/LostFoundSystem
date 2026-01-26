import * as service from '../services/itemService.js';


const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const listItems = async (req, res) => {
    try {
        const {
            page = 1,
            limit = DEFAULT_LIMIT,
            ...filters
        } = req.query

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const pageSize = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);

        const { allItems, pagination } = await service.listItemsService(filters, pageNumber, pageSize);


        return res.status(200).send({
            allItems,
            pagination,
        });

    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const getItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ err: 'No id' });

        const item = await service.getItemService(id);

        if (!item) return res.status(400).send({ err: "Can't get item" });

        return res.status(200).send({ item, });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}


export const createItem = async (req, res) => {
    try {
        const {
            title,
            government,
            city
        } = req.body;
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
