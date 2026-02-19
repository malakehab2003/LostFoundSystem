import { Notification, User } from "../models/db.js";
import { getIO } from "../utils/socket.js";
import { getItems } from "../utils/item.js";
import { emailQueue } from '../utils/emailQueue.js';


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

        const users = await User.findAll({
            where: { id: userIds },
            attributes: ['email']
        });

        for (const user of users) {
            await emailQueue.add('sendEmail', {
                to: user.email,
                subject: `New Notification ${message}`,
                text: `${description} - Check it here: /${entity}/${entity_id}`
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 }
            });
        }
}


export const sendNotificationToRelatedReports = async (category_id, type, city_id, item_id) => {
    const searchType = type === 'lost'? 'found': 'lost';
    const where = {
        type: searchType,
        item_category_id: category_id,
    };

    if (city_id) where.city_id = city_id;

    const items = await getItems(where, 100000, 0, [['created_at', 'DESC']]);
    const userIds = [...new Set(items.map(item => item.user_id))];
    if (!userIds.length) return;

    const description = 'A new item added match your reported item go and check it';
    const message = 'New item for you';
    const entity = 'item';
    const entity_id = item_id;

    await sendNotificationsService(userIds, description, message, entity, entity_id);
}
