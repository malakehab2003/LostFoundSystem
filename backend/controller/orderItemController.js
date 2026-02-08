import { Order } from "../models/db.js";
import * as service from '../services/orderItemService.js';


export const listItems = async (req, res) => {
    try {
        const { order_id } = req.params;
        const user = req.user;

        const order = await Order.findOne({
            where: {id: order_id, user_id: user.id}
        });
        if (!order) return res.status(400).send({ err: "Can't get this order" });
        const where = { order_id, };

        const items = await service.getOrderItems(where);

        if (!items) return res.status(400).send({ err: "Can't get items" });

        return res.status(200).send({ items, });
    } catch (err) {
        return res.status(400).send({ err: err.message });
    }
}
