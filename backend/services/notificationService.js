import { Notification } from "../models/db.js";
import { getIO } from "../utils/socket.js";


export const sendNotificationsService = async (users, description, message) => {
    const io = getIO();
    const notificationsData = users.map(user => ({
            description,
            message,
            user_id: user.id
        }));

        const created = await Notification.bulkCreate(notificationsData);

        created.forEach(notification => {
            io.to(notification.user_id.toString()).emit("notification", {
                id: notification.id,
                description: notification.description,
                message: notification.message,
            });
        });
}
