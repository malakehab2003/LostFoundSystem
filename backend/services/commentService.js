import { Comment } from "../models/db.js";


export const getCommentAndCheckUser = async (id, user_id) => {
    if (!id || !user_id) throw new Error ("Missing requried data");

    const comment = await Comment.findByPk(id);

    if (!comment || comment.user_id !== user_id) throw new Error ("Can't get comment");

    return comment
}
