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
exports.commentsServis = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
exports.commentsServis = {
    getComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_repository_1.commentsRepository.getComment(commentId);
            return comment;
        });
    },
    deleteComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isdelete = yield comments_repository_1.commentsRepository.deleteComment(id, userId);
            return isdelete;
        });
    },
    updateContent(content, commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const UpdateComment = yield comments_repository_1.commentsRepository.updateComment(content, commentId, userId);
            return UpdateComment;
        });
    },
    createComments(userId, userLogin, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentNew = {
                id: Number(new Date()).toString(),
                content: content,
                userId: userId,
                userLogin: userLogin,
                addedAt: new Date().toString(),
                postId: postId,
            };
            const result = yield comments_repository_1.commentsRepository.createComment(commentNew);
            return result;
        });
    },
    getCommentsPost(pageSize, pageNumber, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount } = yield comments_repository_1.commentsRepository.getCommentAll(pageSize, pageNumber, postId);
            if (totalCount === 0) {
                return false;
            }
            else {
                let pagesCount = Number(Math.ceil(totalCount / pageSize));
                const result = {
                    pagesCount: pagesCount,
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: items,
                };
                return result;
            }
        });
    },
};
//# sourceMappingURL=comments-servis.js.map