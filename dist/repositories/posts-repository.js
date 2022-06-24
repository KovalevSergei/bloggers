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
exports.postsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
exports.postsRepository = {
    getPosts(pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.postsCollection
                .find({}, { projection: { _id: 0 } })
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)
                .toArray();
            const totalCount = yield db_1.postsCollection.countDocuments();
            return {
                totalCount: totalCount,
                items: posts,
            };
        });
    },
    getpostsId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.findOne({ id: id });
        });
    },
    updatePostsId(id, title, shortDescription, content, bloggerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postsnew = yield db_1.postsCollection.updateOne({ bloggerId: bloggerId }, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                },
            });
            return postsnew.matchedCount === 1;
        });
    },
    createPosts(postsnew) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.insertOne(Object.assign(Object.assign({}, postsnew), { _id: new mongodb_1.ObjectId() }));
            return postsnew;
        });
    },
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
};
//# sourceMappingURL=posts-repository.js.map