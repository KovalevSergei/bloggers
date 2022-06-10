"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
//import { ReadableStreamBYOBRequest } from 'stream/web';
//import { request } from 'http';
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(body_parser_1.default.json());
const bloggers = [
    { id: 1, name: "Vasy", youtubeUrl: "dvjdjvf" },
    { id: 2, name: "Pety", youtubeUrl: "dvjdjvf123" },
    { id: 3, name: "Sergei", youtubeUrl: "dvjdjvfgdsfg" },
];
app.get("/bloggers", (req, res) => {
    res.send(bloggers);
});
app.get("/bloggers/:bloggersid", (req, res) => {
    const id = +req.params.bloggersid;
    const blog = bloggers.find(v => v.id === id);
    if (blog) {
        res.json(blog);
    }
    else {
        res.sendStatus(404);
    }
});
app.post("/bloggers", (req, res) => {
    let title = req.body.title;
    if (!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "string"
                }
            ]
        });
        return;
    }
    const name = req.body.name;
    const youtubeUrl = req.body.youtubeUrl;
    const bloggersnew = {
        id: +(new Date()),
        name: name,
        youtubeUrl: youtubeUrl
    };
    bloggers.push(bloggersnew);
    res.status(201).send(bloggersnew);
});
app.delete('/bloggers/:id', (req, res) => {
    // put your code here
    const id = +req.params.id;
    const index = bloggers.findIndex(v => v.id === id);
    if (index === -1) {
        res.sendStatus(404);
    }
    else {
        bloggers.splice(index, 1);
        res.sendStatus(204);
    }
});
app.put('/bloggers/:id', (req, res) => {
    let title = req.body.name;
    let urll = req.body.youtubeUrl;
    if (!title || typeof title !== 'string' || !title.trim() || !urll || typeof urll !== "string" || !urll.trim()) {
        res.status(400).send({
            "errorsMessages": [{
                    "message": "Incorrect title",
                    "field": "title"
                }
            ],
        });
        return;
    }
    // put your code here
    const id = +req.params.id;
    const bloggersnew = bloggers.find(v => v.id === id);
    if (!bloggersnew) {
        res.sendStatus(404);
    }
    else {
        bloggers[id] = req.body.name;
        bloggers[id] = req.body.youtubeUrl;
        res.status(204);
        res.json(bloggers);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=test.js.map