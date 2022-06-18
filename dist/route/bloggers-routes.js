"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloggersRouter = void 0;
const express_1 = require("express");
const bloggers_repository_1 = require("../repositories/bloggers-repository");
exports.bloggersRouter = (0, express_1.Router)();
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const basicAuth_1 = __importDefault(require("../middleware/basicAuth"));
const maxNameLength = 15;
const urlRegExp = "^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$";
const nameValidation = (0, express_validator_1.body)('name').exists().trim().notEmpty().isLength({ min: 1, max: 15 }).withMessage(`Name should be less than ${maxNameLength} symbols`);
const youtubeUrlValidation = (0, express_validator_1.body)("youtubeUrl").exists().trim().notEmpty().isString().matches(urlRegExp).isLength({ min: 1, max: 100 });
exports.bloggersRouter.get("/", (req, res) => {
    const getBloggers = bloggers_repository_1.bloggersRepository.getBloggers();
    res.send(getBloggers);
});
exports.bloggersRouter.get("/:bloggersid", (req, res) => {
    const blog = bloggers_repository_1.bloggersRepository.getBloggersById(+req.params.bloggersid);
    if (blog) {
        res.status(200).json(blog);
    }
    else {
        res.sendStatus(404);
    }
});
exports.bloggersRouter.delete('/:id', basicAuth_1.default, (req, res) => {
    const bloggerdel = bloggers_repository_1.bloggersRepository.deleteBloggersById(+req.params.id);
    if (bloggerdel) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.bloggersRouter.post("/", basicAuth_1.default, nameValidation, youtubeUrlValidation, validation_1.inputValidation, (req, res) => {
    const bloggersnew = bloggers_repository_1.bloggersRepository.createBloggers(req.body.name, req.body.youtubeUrl);
    if (bloggersnew) {
        res.status(201).send(bloggersnew);
    }
});
exports.bloggersRouter.put('/:id', basicAuth_1.default, nameValidation, youtubeUrlValidation, validation_1.inputValidation, (req, res) => {
    const bloggersnew = bloggers_repository_1.bloggersRepository.updateBloggers(+req.params.id, req.body.name, req.body.youtubeUrl);
    if (bloggersnew) {
        res.status(204).json(bloggersnew);
    }
    else {
        res.sendStatus(404);
    }
});
//# sourceMappingURL=bloggers-routes.js.map