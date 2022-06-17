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





 

 app.delete('/posts/:id', (req : Request, res : Response)=>{
  const id= +req.params.id;
  const ind=posts.findIndex(v => v.id=== id)
  if (ind===-1){
    res.sendStatus(404)
  }else{
    posts.splice(ind,1)
    res.sendStatus(204)
  }
 })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
