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
exports.commentsRouter = void 0;
exports.commentsRouter = (0, express_1.Router)();
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const comments_servis_1 = require("../domain/comments-servis");
const contentValidation = (0, express_validator_1.body)("content")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 20, max: 300 });
exports.commentsRouter.put("/:commentId", auth_1.authMiddleware, contentValidation, validation_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const content = req.body.content;
    const commentId = req.params.commentId;
    const useriD = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "1";
    const contentnew = yield comments_servis_1.commentsServis.updateContent(content, commentId, useriD);
    if (contentnew === null) {
        return res.sendStatus(404);
    }
    if (contentnew === true) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(403);
    }
}));
exports.commentsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = yield comments_servis_1.commentsServis.getComment(req.params.id);
    if (!commentId) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(commentId);
    }
}));
exports.commentsRouter.delete("/:id", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || "1";
    const isdelete = yield comments_servis_1.commentsServis.deleteComment(req.params.id, userId);
    if (isdelete === null) {
        res.sendStatus(403);
    }
    if (isdelete) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
//# sourceMappingURL=comments-routes.js.map