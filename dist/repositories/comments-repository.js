"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
exports.commentsRepository = {
    getComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentsCollection
                .find({ id: id }, { projection: { _id: 0, userId: 0 } })
                .toArray();
            return comment;
        });
    },
    deleteComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const delComment = yield db_1.commentsCollection.findOne({ id: id });
            if (delComment === null) {
                return false;
            }
            if (delComment.userId !== userId) {
                return null;
            }
            else {
                const result = yield db_1.commentsCollection.deleteOne({ id: id });
                return result.deletedCount === 1;
            }
        });
    },
    updateComment(content, commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.commentsCollection.findOne({ id: commentId });
            if (user === null) {
                return null;
            }
            if (user.userId === userId) {
                yield db_1.commentsCollection.updateOne({ id: commentId }, { $set: { content: content } });
                return true;
            }
            else {
                return false;
            }
        });
    },
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.commentsCollection.insertOne(Object.assign(Object.assign({}, comment), { _id: new mongodb_1.ObjectId() }));
            return {
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: comment.addedAt,
            };
        });
    },
    getCommentAll(pageSize, pageNumber, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalCount = yield db_1.commentsCollection.countDocuments({
                postId: { $regex: postId },
            });
            const items = yield db_1.commentsCollection
                .find({ postId: postId }, { projection: { _id: 0, postId: 0 } })
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)
                .toArray();
            return { items: items, totalCount: totalCount };
        });
    },
};
//# sourceMappingURL=comments-repository.js.map