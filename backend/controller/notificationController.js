import { Notification } from "../models/db.js";


export const listNotifications = async (req, res) => {
    try {
        const user = req.user;

        const notifications = await Notification.findAll({
            where: {user_id: user.id},
        });

        return res.status(200).send({
            notifications,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}