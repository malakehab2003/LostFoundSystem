import * as service from '../services/messageService.js';
import { getChat } from '../services/chatService.js';
import { sendNotificationsService } from '../services/notificationService.js';


export const createMessage = async (req, res) => {
    try {
        const user = req.user;
        const { content, chat_id } = req.body;
        if (!content || !chat_id) return res.status(400).send({ err: "Missing chat_id or content", });
        const data = { chat_id, content, sender_id: user.id }

        const chat = await getChat({ id: chat_id });
        if (!chat) return res.status(400).send({ err: "Chat not found", });
        service.validateChatToUser(chat, user.id);

        const message = await service.createMessageService(data);
        if (!message) return res.status(400).send({ err: "Can't create message", });
        
        // use socket io to make real time chat
        service.realTimeMessage(chat, user.id, content);
        
        // send notification after create message
        const description = "You got a new Message go and check it";
        const notificationMessage = "New Message";
        const receiver_id = chat.sender_id === user.id ? chat.receiver_id : chat.sender_id;
        await sendNotificationsService([receiver_id], description, notificationMessage, 'chat', chat.id)

        return res.status(201).send({ message, })
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const getMessages = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const user = req.user;
        if (!chat_id) return res.status(400).send({ err: "Missing chat_id", });
        const chat = await getChat({ id: chat_id });
        if (!chat) return res.status(400).send({ err: "No chat found", });
        service.validateChatToUser(chat, user.id);
        
        const messages = await service.getMessagesService(chat_id);

        return res.status(200).send({ messages });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
