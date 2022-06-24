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
exports.bloggersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
exports.bloggersRepository = {
    getBloggers(pageSize, pageNumber, SearhName) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (SearhName)
                filter.name = { $regex: SearhName };
            const totalCount = yield db_1.bloggersCollection.countDocuments();
            const items = yield db_1.bloggersCollection
                .find(filter, { projection: { _id: 0 } })
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)
                .toArray();
            return {
                totalCount: totalCount,
                items: items,
            };
        });
    },
    getBloggersById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.bloggersCollection.findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    deleteBloggersById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.bloggersCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    createBloggers(bloggersnew) {
        return __awaiter(this, void 0, void 0, function* () {
            const bloggersNew = yield db_1.bloggersCollection.insertOne(Object.assign(Object.assign({}, bloggersnew), { _id: new mongodb_1.ObjectId() }));
            return bloggersnew;
        });
    },
    updateBloggers(id, name, youtubeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.bloggersCollection.updateOne({ id: id }, { $set: { name: name, youtubeUrl: youtubeUrl } });
            return result.matchedCount === 1;
        });
    },
    getBloggersPost(bloggerId, pageSize, pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const postsBloggerId = yield db_1.postsCollection
                .find({ bloggerId: bloggerId })
                .toArray();
            const totalCount = postsBloggerId.length;
            const items = yield db_1.postsCollection
                .find({ bloggerId: bloggerId }, { projection: { _id: 0 } })
                .limit(pageSize)
                .skip((pageNumber - 1) * pageSize)
                .toArray();
            console.log(items);
            return {
                totalCount: totalCount,
                items: items,
            };
        });
    },
    createBloggersPost(postnew) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield db_1.postsCollection.insertOne(Object.assign(Object.assign({}, postnew), { _id: new mongodb_1.ObjectId() }));
            return postnew;
        });
    },
};
//# sourceMappingURL=bloggers-repository.js.map