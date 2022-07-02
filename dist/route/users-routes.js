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
exports.usersRouter = void 0;
const express_1 = require("express");
const Users_servis_1 = require("../domain/Users-servis");
exports.usersRouter = (0, express_1.Router)();
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const basicAuth_1 = __importDefault(require("../middleware/basicAuth"));
const loginValidation = (0, express_validator_1.body)("login")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 });
const passwordValidation = (0, express_validator_1.body)("password")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 30 });
exports.usersRouter.post("/", basicAuth_1.default, loginValidation, passwordValidation, validation_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const login = req.body.login;
    const password = req.body.password;
    const newUser = yield Users_servis_1.UsersServis.createUser(login, password);
    if (newUser) {
        res.status(200).send(newUser);
    }
    else {
        res.status(400).json({
            errorsMessages: { message: "login is use", field: "give new login" },
        });
    }
}));
exports.usersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("users");
    const PageNumber = Number(req.query.PageNumber) || 1;
    const PageSize = Number(req.query.PageSize) || 10;
    const getUsers = yield Users_servis_1.UsersServis.getUsers(PageNumber, PageSize);
    return res.send(getUsers);
}));
exports.usersRouter.delete("/:id", basicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDel = yield Users_servis_1.UsersServis.deleteUserId(req.params.id);
    if (userDel) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
//# sourceMappingURL=users-routes.js.map