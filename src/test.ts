import express, {Request, Response} from 'express';
import bodyParser from 'body-parser'
import { send } from 'process';
import {posts} from "./repositories/db"
import {bloggersRouter} from "./route/bloggers-routes"
import {postsRouter} from "./route/posts-router"

//import { ReadableStreamBYOBRequest } from 'stream/web';
//import { request } from 'http';

const app = express(); 
const port = process.env.PORT ||3000;
app.use(bodyParser.json())
app.use("/bloggers",bloggersRouter)
app.use("/posts",postsRouter)





 


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
