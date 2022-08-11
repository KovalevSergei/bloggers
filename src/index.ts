import "reflect-metadata";
import express, { application, Request, Response } from "express";
import bodyParser from "body-parser";
import { send } from "process";
import { bloggersRouter } from "./route/bloggers-routes";
import { postsRouter } from "./route/posts-router";
import { usersRouter } from "./route/users-routes";
import { commentsRouter } from "./route/comments-routes";
import { authRouter } from "./route/auth-router";
import { testingRouter } from "./route/testing-route";
//import cookieparser from "../node_modules/cookie-parser";
import cookieparser from "cookie-parser";
import { runDb } from "./repositories/db";

const app = express();
app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(cookieparser());

const port = process.env.PORT || 3000;

app.use("/users", usersRouter);
app.use("/bloggers", bloggersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authRouter);
app.use("/testing", testingRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  runDb();
});

//netstat -ano | findstr :3000
//tskill 3000
