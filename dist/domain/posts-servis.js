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
exports.postsServis = void 0;
const bloggers_repository_1 = require("../repositories/bloggers-repository");
const posts_repository_1 = require("../repositories/posts-repository");
exports.postsServis = {
    getPosts(pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount } = yield posts_repository_1.postsRepository.getPosts(pageNumber, pageSize);
            let pagesCount = Number(Math.ceil(totalCount / pageSize));
            const result = {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: items,
            };
            return result;
        });
    },
    getpostsId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.getpostsId(id);
        });
    },
    updatePostsId(id, title, shortDescription, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameblog = yield bloggers_repository_1.bloggersRepository.getBloggersById(bloggerId);
            if (!nameblog) {
                return null;
            }
            else {
                return yield posts_repository_1.postsRepository.updatePostsId(id, title, shortDescription, content, bloggerId);
            }
        });
    },
    createPosts(title, shortDescription, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameblog = yield bloggers_repository_1.bloggersRepository.getBloggersById(bloggerId);
            if (nameblog) {
                const postnew = {
                    id: Number(new Date()).toString(),
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    bloggerId: bloggerId,
                    bloggerName: nameblog.name,
                };
                yield posts_repository_1.postsRepository.createPosts(postnew);
                return postnew;
            }
            else {
                return false;
            }
        });
    },
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repository_1.postsRepository.deletePosts(id);
        });
    },
};
//# sourceMappingURL=posts-servis.js.map