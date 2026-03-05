import { Chat, User, Message } from '../models/db.js';


export const getChat = async (where) => {
    if (!where) throw new Error("No where found");

    const chat = await Chat.findOne({ where });
    return chat;
}


export const getChats = async (where) => {
    if (!where) throw new Error("No where found");


    const chats = await Chat.findAll(
        { 
            where,
            include: [
                {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'name']
                },

                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'name']
                },

                {
                    model: Message,
                    as: 'messages',
                    attributes: ["id", "content", "created_at"],
                    limit: 1,
                    order: [["created_at", "DESC"]]
                }
            ]
         }
    );
    return chats;
}


export const createChat = async (data) => {
    if (!data) throw new Error("No data to create chat found");

    const chat = await Chat.create(data);
    if (!chat) throw new Error("Can't create chat");

    return chat;
}
