import * as service from '../services/messageService.js';
import { getChat } from '../services/chatService.js';


export const createMessage = async (req, res) => {
    try {
        const user = req.user;
        const { content, chat_id } = req.body;
        if (!content || !chat_id) return res.status(400).send({ err: "Missing chat_id or content", });
        const data = { chat_id, content, sender_id: user.id }

        const chat = await getChat({id: chat_id});
        if (!chat) return res.status(400).send({ err: "Chat not found", });
        if (chat.sender_id !== user.id && chat.receiver_id !== user.id) return res.status(400).send({ err: "Can't send message to this chat", });

        const message = await service.createMessageService(data);
        if (!message) return res.status(400).send({ err: "Can't create message", });

        service.realTimeMessage(chat, user.id, content);

        return res.status(201).send({ message, })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}