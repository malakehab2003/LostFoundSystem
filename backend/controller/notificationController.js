import { Notification, User } from "../models/db.js";
import { getAllUsersService } from "../services/userService.js";
import * as service from '../services/notificationService.js';


export const listNotifications = async (req, res) => {
    try {
        const user = req.user;

        const notifications = await Notification.findAll({
            where: {user_id: user.id},
        });

        await Notification.update(
            { is_read: true },
            { where: { user_id: user.id, is_read: false } }
        );

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
        let userIds = [];

        if (!description || !message) {
            return res.status(400).send({ err: "Missing description or message" });
        }

        if (sendToAll) {
            const users = await getAllUsersService();
            userIds = users.map(user => user.id);
        } 
        else if (Array.isArray(user_ids) && user_ids.length > 0) userIds = user_ids;
        else return res.status(400).send({ err: "No users selected" });

        await service.sendNotificationsService(userIds, description, message);
        return res.send({
            message: "Notifications created successfully",
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const countNotRead = async (req, res) => {
    try {
        const user = req.user;

        const notifications = await Notification.findAll({
            where: {user_id: user.id, is_read: false},
        });

        return res.status(200).send({
            count: notifications.length,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
