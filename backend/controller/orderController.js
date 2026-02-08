import { removePromocodeFromUser } from "../services/promocodeService.js";
import { Order, User, Address } from "../models/db.js";
import { validateAddressToUser } from "../services/addressService.js";
import * as service from '../services/orderService.js';

export const createOrder = async (req, res) => {
    try {
        const user = req.user;
        const { ...data } = req.body;
        if (!data.total_price || !data.receive_type || !data.payment_type) return res.status(400).send({err: "Missing requried fields"});
        if (data.receive_type === 'delivery' && !data.address_id) return res.status(400).send({err: "Address is requried"});
        if (data.receive_type === 'pickup' && data.address_id) delete data.address_id;
        if (data.address_id) await validateAddressToUser(user.id, data.address_id);
        if (data.promo_code_id) await removePromocodeFromUser(data.promo_code_id, user);
        data.user_id = user.id;
        data.order_status = 'processing';

        const order = await Order.create({
            ...data
        });

        if (!order) return res.status(400).send({err: "Can't create order"});

        return res.status(201).send({
            message: "Order created successfully",
            order,
        });
    } catch (err) {
        return res.status(400).send({err: err.message});
    }
}


export const listOrders = async (req, res) => {
    try {
        const user = req.user;
        const where = {user_id: user.id}

        const orders = await service.getOrders(where);

        if (!orders) return res.status(400).send({err: "Can't get orders"});

        return res.status(200).send({ orders, });
    } catch (err) {
        return res.status(400).send({err: err.message});
    }
}


export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!id) return res.status(400).send({err: "Missing id"});
        const where = { id, user_id: user.id };

        const order = await service.getOrders(where);
        if (!order) return res.status(400).send({err: "Can't get order"});

        return res.status(200).send({
            order: order[0],
        });
    } catch (err) {
        return res.status(400).send({err: err.message});
    }
}
