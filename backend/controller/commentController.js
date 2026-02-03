import { Comment } from "../models/db.js";


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

        return res.status(201).send({
            message: "Comment created successfully",
            comment,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}


const getCommentAndCheckUser = async (id, user_id) => {
    if (!id || !user_id) throw new Error ("Missing requried data");

    const comment = await Comment.findByPk(id);

    if (!comment || comment.user_id !== user_id) throw new Error ("Can't get comment");

    return comment
}


export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const comment = await getCommentAndCheckUser(id, user.id);

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

        const comment = await getCommentAndCheckUser(id, user.id);

        comment.content = content;
        await comment.save();

        return res.status(200).send({
            message: "comment updated successfully",
            comment,
        });
    } catch (err) {
        return res.status(400).send({ err: err.message, });
    }
}
