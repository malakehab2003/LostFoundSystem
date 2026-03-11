import * as service from "../services/chatService.js";
import { Op } from "sequelize";
import { countUnread } from "../services/messageService.js";


export const createChat = async (req, res) => {
    try {
        const user = req.user;
        const { receiver_id } = req.body;
        if (!receiver_id) return res.status(400).send({ err: "Missing receiver_id", });
        if (receiver_id === user.id) return res.status(400).send({ err: "Can't message yourself", });

        const where = {
            [Op.or]: [
                { sender_id: user.id, receiver_id },
                { sender_id: receiver_id, receiver_id: user.id },
            ],
        };

        const chat = await service.getChat(where);

        if (chat) return res.status(200).send({ chat, });

        const newChat = await service.createChat({ sender_id: user.id, receiver_id, });

        return res.status(201).send({ newChat, });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const listChats = async (req, res) => {
    try {
        const user = req.user;
        const where = {
            [Op.or]: [
                { sender_id: user.id },
                { receiver_id: user.id },
            ],
        };

        const chats = await service.getChats(where);

        const formattedChats = await Promise.all(
            chats.map(async (chat) => {
                const other_user = chat.sender_id === user.id ? chat.receiver: chat.sender;
                const unread = await countUnread(chat.id, user.id);
                return {
                    chat_id: chat.id,
                    other_user,
                    last_message: chat.messages[0]?.content || null,
                    unread
                }
            })
        );

        return res.status(200).send({ formattedChats, });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}