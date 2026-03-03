import { Chat } from '../models/db.js';


export const getChat = async (where) => {
    if (!where) throw new Error("No where found");

    const chat = await Chat.findOne({ where });
    return chat;
}


export const getChats = async (where) => {
    if (!where) throw new Error("No where found");

    const chat = await Chat.findAll({ where });
    return chat;
}


export const createChat = async (data) => {
    if (!data) throw new Error("No data to create chat found");

    const chat = await Chat.create(data);
    if (!chat) throw new Error("Can't create chat");

    return chat;
}
