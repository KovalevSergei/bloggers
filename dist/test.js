"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./repositories/db");
const bloggers_routes_1 = require("./route/bloggers-routes");
const posts_router_1 = require("./route/posts-router");
//import { ReadableStreamBYOBRequest } from 'stream/web';
//import { request } from 'http';
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use("/bloggers", bloggers_routes_1.bloggersRouter);
app.use("/posts", posts_router_1.postsRouter);
app.delete('/posts/:id', (req, res) => {
    const id = +req.params.id;
    const ind = db_1.posts.findIndex(v => v.id === id);
    if (ind === -1) {
        res.sendStatus(404);
    }
    else {
        db_1.posts.splice(ind, 1);
        res.sendStatus(204);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=test.js.map