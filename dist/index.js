"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bloggers_routes_1 = require("./route/bloggers-routes");
const posts_router_1 = require("./route/posts-router");
const users_routes_1 = require("./route/users-routes");
const comments_routes_1 = require("./route/comments-routes");
const auth_router_1 = require("./route/auth-router");
//import { authRouter } from "./route/auth-routes";
//import { ReadableStreamBYOBRequest } from 'stream/web';
//import { request } from 'http';
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use("/users", users_routes_1.usersRouter);
app.use("/bloggers", bloggers_routes_1.bloggersRouter);
app.use("/posts", posts_router_1.postsRouter);
app.use("/comments", comments_routes_1.commentsRouter);
app.use("/auth", auth_router_1.authRouter);
//app.use('/auth', authRouter);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map