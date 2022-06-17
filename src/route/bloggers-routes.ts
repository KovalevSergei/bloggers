import { Router,Request, Response} from "express"
import { bloggersRepository } from "../repositories/bloggers-repository"
export const bloggersRouter=Router()
import {body, validationResult} from 'express-validator'
import {inputValidation} from '../middleware/validation'

const urlRegExp=/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
const nameValidation=body('name').isLength({min:1, max: 15}).trim().isString()
const youtubeUrlValidation=body("youtubeUrl").isString().trim().matches(urlRegExp).isLength({min:1, max: 100})
import {basicAuthMiddlewareBuilder} from '../middleware/basicAuth';

bloggersRouter.get("/", (req: Request, res: Response) => {
    const getBloggers=bloggersRepository.getBloggers();
    res.send(getBloggers)
})

bloggersRouter.get("/:bloggersid", (req : Request, res : Response) =>{
    const blog=bloggersRepository.getBloggersById(+req.params.bloggersId)
    if (blog){
      res.json(blog)
      res.sendStatus(200)
    }else{
      res.sendStatus(404)
    }
  })

bloggersRouter.delete('/:id',(req: Request, res: Response)=>{
    const bloggerdel=bloggersRepository.deleteBloggersById(+req.params.id)
    if (bloggerdel){
    res.sendStatus(204)
    }else{
    res.sendStatus(404)  
    }
   
   })
   bloggersRouter.use(basicAuthMiddlewareBuilder)
   bloggersRouter.post("/",nameValidation,youtubeUrlValidation,inputValidation, (req : Request, res: Response)=>{
    const bloggersnew=bloggersRepository.createBloggers(req.body.name,req.body.youtubeUrl )
    if (bloggersnew){
    res.status(201).send(bloggersnew)   
    }
   
  })
  

  bloggersRouter.put('/:id',nameValidation,youtubeUrlValidation,inputValidation,(req: Request, res: Response)=>{
    const bloggersnew=bloggersRepository.updateBloggers(+req.params.id, req.params.name, req.params.youtubeUrl)
    if(bloggersnew){
        res.status(204)
        res.json(bloggersnew)
    }else{
        res.sendStatus(404)   
    }

 
           
  

  })
  
  