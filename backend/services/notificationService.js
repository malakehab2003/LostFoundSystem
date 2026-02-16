import { Notification } from "../models/db.js";
import { getIO } from "../utils/socket.js";


export const sendNotificationsService = async (userIds, description, message, entity, entity_id) => {
    const io = getIO();
    const notificationsData = userIds.map(user => ({
            description,
            message,
            user_id: user,
            entity,
            entity_id
        }));

        const created = await Notification.bulkCreate(notificationsData);

        created.forEach(notification => {
            io.to(notification.user_id.toString()).emit("notification", {
                id: notification.id,
                description: notification.description,
                message: notification.message,
                entity: notification.entity,
                entity_id: notification.entity_id,
            });
        });
}
