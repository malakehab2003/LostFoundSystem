import { Comment } from "../models/db.js";
import * as service from '../services/commentService.js';
import { sendNotificationsService } from "../services/notificationService.js";


export const addComment = async (req, res) => {
    try {
        const {
        itemId,
        content,
        } = req.body;
        const user = req.user;

        if (!itemId || !content || !user) return res.status(400).send({ err: "Missing required fields", });

        const comment = await Comment.create({
            content,
            item_id: itemId,
            user_id: user.id,
        });

        if (!comment) return res.status(400).send({ err: "Can't create comment", });
        
        const description = "A new person added a comment in your item go and check this";
        const message = "New comment";
        const entity = 'item';
        const entity_id = comment.item_id;
        await sendNotificationsService([comment.user_id], description, message, entity, entity_id);

        return res.status(201).send({
            message: "Comment created successfully",
            comment,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}



export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const comment = await service.getCommentAndCheckUser(id, user.id);

        await comment.destroy();

        return res.status(200).send({
            message: "Comment deleted successfully",
        }); 
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const { content } = req.body;

        const comment = await service.getCommentAndCheckUser(id, user.id);

        comment.content = content;
        await comment.save();

        const description = "Someone updated his comment in your item go and check this";
        const message = "Updated comment";
        const entity = 'item';
        const entity_id = comment.item_id;
        await sendNotificationsService([comment.user_id], description, message, entity, entity_id);

        return res.status(200).send({
            message: "comment updated successfully",
            comment,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
