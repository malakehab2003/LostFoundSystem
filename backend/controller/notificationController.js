import { Notification, User } from "../models/db.js";
import { getAllUsersService } from "../services/userService.js";


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


export const createNotification = async (req, res) => {
    try {
        const { description, message, sendToAll, user_ids } = req.body;
        let users = [];

        if (!description || !message) {
            return res.status(400).send({ err: "Missing description or message" });
        }

        if (sendToAll) users = await getAllUsersService();

        else if (user_ids && user_ids.length > 0) users = await User.findAll({ where: { id: user_ids} });

        else return res.status(400).send({ err: "No users selected" });

        const notificationsData = users.map(user => ({
            description,
            message,
            user_id: user.id
        }));

        await Notification.bulkCreate(notificationsData);
        return res.send({
            message: "Notifications created successfully",
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
