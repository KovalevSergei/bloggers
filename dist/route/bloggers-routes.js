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
exports.bloggersRouter = void 0;
const express_1 = require("express");
const bloggers_servis_1 = require("../domain/bloggers-servis");
exports.bloggersRouter = (0, express_1.Router)();
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const basicAuth_1 = __importDefault(require("../middleware/basicAuth"));
const posts_router_1 = require("../route/posts-router");
const maxNameLength = 15;
const urlRegExp = "^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$";
const nameValidation = (0, express_validator_1.body)("name")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 })
    .withMessage(`Name should be less than ${maxNameLength} symbols`);
const youtubeUrlValidation = (0, express_validator_1.body)("youtubeUrl")
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .matches(urlRegExp)
    .isLength({ min: 1, max: 100 });
exports.bloggersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const SearhName = req.query.SearhNameTerm || null;
    if (typeof SearhName === "string" || !SearhName) {
        const getBloggers = yield bloggers_servis_1.bloggersServis.getBloggers(pageSize, pageNumber, SearhName);
        return res.send(getBloggers);
    }
    res.sendStatus(400);
}));
exports.bloggersRouter.get("/:bloggersid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield bloggers_servis_1.bloggersServis.getBloggersById(+req.params.bloggersid);
    if (blog) {
        res.status(200).json(blog);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.bloggersRouter.delete("/:id", basicAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggerdel = yield bloggers_servis_1.bloggersServis.deleteBloggersById(+req.params.id);
    if (bloggerdel) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.bloggersRouter.post("/", basicAuth_1.default, nameValidation, youtubeUrlValidation, validation_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggersnew = yield bloggers_servis_1.bloggersServis.createBloggers(req.body.name, req.body.youtubeUrl);
    if (bloggersnew) {
        res.status(201).send(bloggersnew);
    }
}));
exports.bloggersRouter.put("/:id", basicAuth_1.default, nameValidation, youtubeUrlValidation, validation_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggersnew = yield bloggers_servis_1.bloggersServis.updateBloggers(+req.params.id, req.body.name, req.body.youtubeUrl);
    if (bloggersnew) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.bloggersRouter.get("/:bloggerId/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const bloggerId = +req.params.bloggerId;
    const getPostBlogger = yield bloggers_servis_1.bloggersServis.getBloggersPost(bloggerId, pageSize, pageNumber);
    if (getPostBlogger === false) {
        res.status(404).send("If specific blogger is not exists");
    }
    else {
        return res.send(getPostBlogger);
    }
}));
exports.bloggersRouter.post("/:bloggerId/posts", basicAuth_1.default, posts_router_1.titleValidation, posts_router_1.shortDescriptionValidation, posts_router_1.contentValidation, validation_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggersnew = yield bloggers_servis_1.bloggersServis.createBloggersPost(+req.params.bloggerId, req.body.title, req.body.shortDescription, req.body.content);
    if (bloggersnew) {
        res.status(201).send(bloggersnew);
    }
    else {
        res.status(404).send("If specific blogger doesn't exists");
    }
}));
//# sourceMappingURL=bloggers-routes.js.map