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
exports.UsersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("./db");
exports.UsersRepository = {
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const createUser = yield db_1.userscollection.insertOne(Object.assign(Object.assign({}, newUser), { _id: new mongodb_1.ObjectId() }));
            return { id: newUser.id, login: newUser.login };
        });
    },
    //filters: { page: number, size: number, name: string }
    getUsers(PageSize, PageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalCount = yield db_1.userscollection.countDocuments();
            const items = yield db_1.userscollection
                .find({}, { projection: { _id: 0, passwordHash: 0, passwordSalt: 0 } })
                .skip((PageNumber - 1) * PageSize)
                .limit(PageSize)
                .toArray();
            return { totalCount: totalCount, items: items };
        });
    },
    deleteUsersId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.userscollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    userGetLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersFind = yield db_1.userscollection.find({ login: login }).toArray();
            console.log(usersFind);
            if (usersFind.length > 0) {
                return true;
            }
            else {
                return false;
            }
        });
    },
    FindUserLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersFind = yield db_1.userscollection.findOne({ login: login });
            return usersFind;
        });
    },
    findUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersFind = yield db_1.userscollection.findOne({ _id });
            return usersFind;
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.userscollection.findOne({ id: id }, { projection: { _id: 0 } });
            return result;
        });
    },
};
//# sourceMappingURL=users-repository.js.map