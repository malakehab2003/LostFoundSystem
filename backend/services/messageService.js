import { Message } from "../models/db.js";
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


export const realTimeMessage = (chat, user_id, content) => {
    const receiver_id = chat.sender_id === user_id ? chat.receiver_id : chat.sender_id;
    const io = getIO();

    io.to(receiver_id.toString()).emit("new_message", {
        chat_id: chat.id,
        content,
    })
}
