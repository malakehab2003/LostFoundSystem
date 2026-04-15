import { Message, User } from "../models/db.js";
import { Op } from "sequelize";
import { getIO } from "../utils/socket.js";


export const countUnread = async (chat_id, sender_id) => {
    const unread_count = await Message.count({
        where: {
            chat_id,
            sender_id: { [Op.ne]: sender_id },
            is_read: false,
        },
    });

    return unread_count;
}


export const createMessageService = async (data) => {
    if (!data) throw new Error("No message data");

    const message = await Message.create(data);
    if (!message) throw new Error("Can't create message");

    return message;
}


export const realTimeMessage = (chat, sender_id, content, sender_name, receiver_name, created_at) => {
    const receiver_id = chat.sender_id === sender_id ? chat.receiver_id : chat.sender_id;
    const io = getIO();

    io.to(receiver_id.toString()).emit("new_message", {
        chat_id: chat.id,
        sender_name,
        receiver_name,
        sender_id,
        receiver_id,
        content,
        created_at,
    });

    io.to(sender_id.toString()).emit("new_message", {
        chat_id: chat.id,
        sender_name,
        receiver_name,
        sender_id,
        receiver_id,
        content,
        created_at,
    });
}


export const validateChatToUser = (chat, user_id) => {
    if (chat.sender_id !== user_id && chat.receiver_id !== user_id) throw new Error("Can't send message to this chat");
}


export const getMessagesService = async (chat_id) => {
    if (!chat_id) throw new Error("chat_id is required");

    const messages = await Message.findAll({
        where: { chat_id, },
        order: [["created_at", "ASC"]],
        attributes: { exclude: ["item_id", "receiver_id"] },
        include: [
            {
                model: User,
                as: 'sender',
                attributes: ['id', 'name']
            }
        ]
    });

    await Message.update(
        { is_read: true },
        { where: { chat_id, is_read: false } }
    );
    
    return messages;
}
