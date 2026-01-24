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


        const { rows, pagination } = await service.listItemsService(filters, pageNumber, pageSize);

        return res.status(200).send({
            rows,
            pagination,
        });

    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
