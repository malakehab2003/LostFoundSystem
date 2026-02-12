import { Notification } from "../models/db.js";


export const sendNotificationsService = async (users, description, message) => {
    const notificationsData = users.map(user => ({
            description,
            message,
            user_id: user.id
        }));

        await Notification.bulkCreate(notificationsData);
}
