import express, {Request, Response} from 'express';
import bodyParser from 'body-parser'
import { send } from 'process';

//import { ReadableStreamBYOBRequest } from 'stream/web';
//import { request } from 'http';

const app = express();
const port = process.env.PORT ||5000;
app.use(bodyParser.json())
  
const bloggers=[
  {id: 1, name: "Vasy", youtubeUrl:"dvjdjvf"},
  {id: 2, name: "Pety", youtubeUrl:"dvjdjvf123"},
  {id: 3, name: "Sergei", youtubeUrl:"dvjdjvfgdsfg"},
]
app.get("/bloggers", (req: Request, res: Response) => {
  res.send(bloggers);
  res.sendStatus(200)
})
app.get("/bloggers/:bloggersid", (req : Request, res : Response) =>{
  const id= +req.params.bloggersid;
  const blog=bloggers.find(v => v.id===id)
  if (blog){
    res.json(blog)
    res.sendStatus(200)
  }else{
    res.sendStatus(404)
  }
})
app.post("/bloggers", (req : Request, res: Response)=>{
  const name = req.body.name
  const yout = req.body.youtubeUrl
  
  if(!name || typeof name !=='string' || !name.trim() || name.length>15 || 
  !yout|| typeof yout !=='string' || !yout.trim() || yout.length > 100){
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "string",
          "field": "string"
        },
        { message: "privet", field: "privet" }

      ]
    })
    return


  }
 

  const bloggersnew = {
    id: +(new Date()),
    name: name,
    youtubeUrl: yout
}

  bloggers.push(bloggersnew)
  res.status(201).send(bloggersnew)
})

app.delete('/bloggers/:id',(req: Request, res: Response)=>{
  // put your code here
  const id=+req.params.id;
  const index = bloggers.findIndex(v=>v.id===id)
  if (index===-1){
  res.sendStatus(404)
}else{
  bloggers.splice(index,1)
  res.sendStatus(204)
}

 })




 app.put('/bloggers/:id',(req: Request, res: Response)=>{

  let title= req.body.name
  let urll=req.body.youtubeUrl
  if (!title || typeof title !=='string' || !title.trim() || !urll || typeof urll !=="string" || !urll.trim() || title.length>15 || urll.length>100){
    res.status(400).send({
      "errorsMessages": [{
          "message": "Incorrect title",
          "field": "title" },
          { message: "privet2", field: "privet2" }
      ],
    
    })
    return
  }
         

  const id=+req.params.id;
  const bloggersnew=bloggers.find(v=> v.id===id)

  if(!bloggersnew){
    res.sendStatus(404)
  }else{

    bloggers[id].name= req.body.name;
    bloggers[id].youtubeUrl=req.body.youtubeUrl;
    res.status(204)

    res.json(bloggers)
  }
})


let posts=[
  {
    id: 0,
    title: "pety",
    shortDescription: "va",
    content: "bog",
    bloggerId: 0,
    bloggerName: "ole"
  }
]
 app.get('/posts', ( req : Request, res : Response)=>{
  res.send(posts)
  res.sendStatus(200)
 })


 app.get('/posts/:id', (req : Request, res : Response)=>{
  const id=+req.params.id;
  const postsid=posts.find(v => v.id===id);
  if(!postsid){
    res.sendStatus(404)
    res.sendStatus(400)
  }else{
   res.json(postsid)
   res.sendStatus(200)

  }
 })

 app.put('/posts/:id',(req : Request, res : Response)=>{
  let title = req.body.id

 })
 app.post('/posts', (req : Request, res : Response)=>{
  let title= req.body.title;
  let title2= req.body.shortDescription;
  let title3= req.body.content;
  let title4= req.body.bloggerId;
  if (!title || typeof title !=='string' || !title.trim() || title.length > 30 || 
      !title2 || typeof title2 !=='string' || !title2.trim() || title2.length > 100 || 
      !title3 || typeof title3 !=='string' || !title3.trim() || title3.length > 1000 ||
      !title4 || typeof title4 !=='number') {
        res.status(400).send({
          "errorsMessages": [
            {
              "message": "neverno",
              "field": "neverno"
            }
          ]
        })

  }else{
    const postnew={
      id: +(new Date()),
      title: title,
      shortDescription: title2,
      content: title3,
      bloggerId: title4,
      bloggerName: "ole"
    }
    posts.push(postnew)
    res.sendStatus(201).send(postnew)

  }
 })

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
