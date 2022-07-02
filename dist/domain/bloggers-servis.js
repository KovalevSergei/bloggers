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
exports.bloggersServis = void 0;
const bloggers_repository_1 = require("../repositories/bloggers-repository");
exports.bloggersServis = {
    getBloggers(pageSize, pageNumber, SearhName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount } = yield bloggers_repository_1.bloggersRepository.getBloggers(pageSize, pageNumber, SearhName);
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
    getBloggersById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return bloggers_repository_1.bloggersRepository.getBloggersById(id);
        });
    },
    deleteBloggersById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return bloggers_repository_1.bloggersRepository.deleteBloggersById(id);
        });
    },
    createBloggers(name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const bloggersnew = {
                id: Number(new Date()).toString(),
                name: name,
                youtubeUrl: youtubeUrl,
            };
            const result = bloggers_repository_1.bloggersRepository.createBloggers(bloggersnew);
            return result;
        });
    },
    updateBloggers(id, name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bloggers_repository_1.bloggersRepository.updateBloggers(id, name, youtubeUrl);
        });
    },
    getBloggersPost(bloggerId, pageSize, pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount } = yield bloggers_repository_1.bloggersRepository.getBloggersPost(bloggerId, pageSize, pageNumber);
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
    createBloggersPost(bloggerId, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const findName = yield bloggers_repository_1.bloggersRepository.getBloggersById(bloggerId);
            if (!findName) {
                return false;
            }
            else {
                const postsnew = {
                    id: Number(new Date()).toString(),
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    bloggerId: bloggerId,
                    bloggerName: findName.name,
                };
                const result = yield bloggers_repository_1.bloggersRepository.createBloggersPost(postsnew);
                return result;
            }
        });
    },
};
//# sourceMappingURL=bloggers-servis.js.map