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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersServis = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_repository_1 = require("../repositories/users-repository");
exports.UsersServis = {
    createUser(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginFind = yield users_repository_1.UsersRepository.userGetLogin(login);
            if (loginFind === true) {
                return false;
            }
            else {
                const passwordSalt = yield bcrypt_1.default.genSalt(10);
                const passwordHash = yield this._generateHash(password, passwordSalt);
                const newUser = {
                    id: Number(new Date()).toString(),
                    login: login,
                    passwordHash,
                    passwordSalt,
                };
                return users_repository_1.UsersRepository.createUser(newUser);
            }
        });
    },
    checkCredentials(users, login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.UsersRepository.FindUserLogin(login);
            if (!user)
                return false;
            const passwordHash = yield this._generateHash(password, user.passwordSalt);
            if (user.passwordHash !== passwordHash) {
                return false;
            }
            return user;
        });
    },
    getUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.UsersRepository.FindUserLogin(login);
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    },
    getUsers(PageNumber, PageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount } = yield users_repository_1.UsersRepository.getUsers(PageSize, PageNumber);
            //const userDtos = items.map(i => ({...i, id: i.id.toString()}))
            let pagesCount = Number(Math.ceil(totalCount / PageSize));
            const result = {
                pagesCount: pagesCount,
                page: PageNumber,
                pageSize: PageSize,
                totalCount: totalCount,
                items,
            };
            return result;
        });
    },
    deleteUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.UsersRepository.deleteUsersId(id);
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield users_repository_1.UsersRepository.findUserById(id);
            return result;
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield users_repository_1.UsersRepository.getUserById(id);
            return result;
        });
    },
};
//# sourceMappingURL=Users-servis.js.map