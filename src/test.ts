import express, {Request, response, Response} from 'express';
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
})
app.get("/bloggers/:bloggersid", (req : Request, res : Response) =>{
  const id= +req.params.bloggersid;
  const blog=bloggers.find(v => v.id===id)
  if (blog){
    res.json(blog)
  }else{
    res.sendStatus(404)
  }
})
app.post("/bloggers", (req : Request, res: Response)=>{
  const name = req.body.name
  const youtubeUrl = req.body.youtubeUrl
  
  if(!name || typeof name !=='string' || !name.trim()){
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "string",
          "field": "string"
        }
      ]
    })
    return


  }
 

  const bloggersnew = {
    id: +(new Date()),
    name: name,
    youtubeUrl: youtubeUrl
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
  if (!title || typeof title !=='string' || !title.trim() || !urll || typeof urll !=="string" || !urll.trim()){
    res.status(400).send({
      "errorsMessages": [{
          "message": "Incorrect title",
          "field": "title" }
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

    res.json(bloggers).send(bloggers[id])
  }
})
 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
