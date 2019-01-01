const mongoose = require('mongoose');
const { Types } = require('mongoose');
const User = require('./user.model');
const Story = require('./story.model');
const MyError = require('../lib/MyError');
const { checkObjectId } = require('../lib/checkObjectId');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, trim: true },
    fans: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    story: { type: Schema.Types.ObjectId, ref: 'User' }
});

const CommentModel = mongoose.model('Comment', commentSchema);

class Comment extends CommentModel {
    static async createComment(idUser, idStory, content) {
        checkObjectId([idUser, idStory]);
        const comment = new Comment({ author: idUser, content, story: idStory });
        await comment.save();
        const updateObject = { $addToSet: { comments: comment._id } };
        const story = await Story.findByIdAndUpdate(idStory, updateObject);
        if (!story) {
            await Comment.findByIdAndRemove(comment._id);
            throw new MyError('Cannot find story.', 'CANNOT_FIND_STORY', 404);
        }
        return comment;
    }

    static async updateComment(idUser, idComment, content) {
        checkObjectId([idUser, idComment]);
        const comment = await Comment.findOneAndUpdate({ author: idUser, _id: idComment }, { content }, { new: true })
        .catch(error => null);
        if (!comment) throw new MyError('Cannot find comment', 'CANNOT_FIND_COMMENT', 404);
        return comment;   
    }



    static async removeComment(idUser, idComment) {
        checkObjectId([idUser, idComment]);
        const comment = await Comment.findOneAndRemove({ author: idUser, _id: idComment })
        .catch(error => null);
        if (!comment) throw new MyError('Cannot find comment', 'CANNOT_FIND_COMMENT', 404);
        await Story.findByIdAndUpdate(comment.story, {$pull: {comments: idComment} });
        return comment;
    }

    static async likeComment(idUser, idComment) {
        checkObjectId([idUser, idComment]);
        const comment = await Comment.findByIdAndUpdate( idComment, { $addToSet: {fans: idUser}}, {new: true} )
        // .catch(error => null);
        if (!comment) throw new MyError('Cannot find comment', 'CANNOT_FIND_COMMENT', 404);
        return comment;
    }

    static async dislikeComment(idUser, idComment) {
        checkObjectId([idUser, idComment]);
        const comment = await Comment.findByIdAndUpdate( idComment, { $pull: {fans: idUser} } , {new: true})
        // .catch(error => null);
        if (!comment) throw new MyError('Cannot find comment', 'CANNOT_FIND_COMMENT', 404);
        return comment;
    }
}

module.exports = Comment;