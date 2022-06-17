"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloggersRouter = void 0;
const express_1 = require("express");
const bloggers_repository_1 = require("../repositories/bloggers-repository");
exports.bloggersRouter = (0, express_1.Router)();
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const urlRegExp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
const nameValidation = (0, express_validator_1.body)('name').isLength({ min: 1, max: 15 }).trim().isString();
const youtubeUrlValidation = (0, express_validator_1.body)("youtubeUrl").isString().trim().matches(urlRegExp).isLength({ min: 1, max: 100 });
const basicAuth_1 = require("../middleware/basicAuth");
exports.bloggersRouter.get("/", (req, res) => {
    const getBloggers = bloggers_repository_1.bloggersRepository.getBloggers();
    res.send(getBloggers);
});
exports.bloggersRouter.get("/:bloggersid", (req, res) => {
    const blog = bloggers_repository_1.bloggersRepository.getBloggersById(+req.params.bloggersId);
    if (blog) {
        res.json(blog);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});
exports.bloggersRouter.delete('/:id', (req, res) => {
    const bloggerdel = bloggers_repository_1.bloggersRepository.deleteBloggersById(+req.params.id);
    if (bloggerdel) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.bloggersRouter.use(basicAuth_1.basicAuthMiddlewareBuilder);
exports.bloggersRouter.post("/", nameValidation, youtubeUrlValidation, validation_1.inputValidation, (req, res) => {
    const bloggersnew = bloggers_repository_1.bloggersRepository.createBloggers(req.body.name, req.body.youtubeUrl);
    if (bloggersnew) {
        res.status(201).send(bloggersnew);
    }
});
exports.bloggersRouter.put('/:id', nameValidation, youtubeUrlValidation, validation_1.inputValidation, (req, res) => {
    const bloggersnew = bloggers_repository_1.bloggersRepository.updateBloggers(+req.params.id, req.params.name, req.params.youtubeUrl);
    if (bloggersnew) {
        res.status(204);
        res.json(bloggersnew);
    }
    else {
        res.sendStatus(404);
    }
});
//# sourceMappingURL=bloggers-routes.js.map