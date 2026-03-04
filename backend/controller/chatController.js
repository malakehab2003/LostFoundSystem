import * as service from "../services/chatService.js";


export const createChat = async (req, res) => {
    try {
        const user = req.user;
        const { sender_id } = req.body;
        if (!sender_id) return res.status(400).send({ err: "Missing sender_id", });

        const where = { owner_id: user.id, sender_id, };

        const chat = await service.getChat(where);

        if (chat) return res.status(200).send({ chat, });

        const newChat = await service.createChat(where);

        return res.status(201).send({ newChat, });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const listChats = async (req, res) => {
    try {
        const user = req.user;
        const where = { owner_id: user.id };

        const chats = await service.getChats(where);

        return res.status(200).send({ chats, });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}