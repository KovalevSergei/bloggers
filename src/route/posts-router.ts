import { Router,Request, Response} from "express"
import { postsRepository } from "../repositories/posts-repository"
export const postsRouter=Router()
import {inputValidation} from '../middleware/validation'
import {body, validationResult} from 'express-validator'
import { title } from "process"
import basicAuth from "../middleware/basicAuth"




const titleValidation=body("title").exists().trim().notEmpty().isLength({min:1, max:30}).isString()
const shortDescriptionValidation=body("shortDescription").exists().trim().notEmpty().isString().isLength({min:1, max:100})
const contentValidation=body("content").exists().isString().trim().notEmpty().isLength({min:1, max:1000})
const BlogerIdValidation=body("bloggerId").toInt(32)

postsRouter.get('/', ( req : Request, res : Response)=>{
    const getPosts=postsRepository.getPosts()
    res.send(getPosts)
    res.sendStatus(200)
   })
  

   postsRouter.get('/:postsid', (req : Request, res : Response)=>{
    const postsid=postsRepository.getpostsId(+req.params.postsid)
    if(!postsid){
      res.sendStatus(404)
      res.sendStatus(400)
    }else{
     res.json(postsid)
     res.sendStatus(200)
  
    }
   })

   postsRouter.put('/:id',basicAuth,BlogerIdValidation,titleValidation,shortDescriptionValidation,contentValidation, inputValidation, (req : Request, res : Response)=>{
    const postsnew=postsRepository.updatePostsId(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
    if(postsnew){
    res.status(204).send(postsnew)
    res.json(postsnew)
    }else{
        res.status(400).send({ errorsMessages: [{ message: 'bloger', field: "bloggerId" }] })   
    }
/*     let title= req.body.title;
    let title2= req.body.shortDescription;
    let title3= req.body.content;
    let title4= req.body.bloggerId;
    const errs2=[]
  
    }
  
    }
    if (!title3 || typeof title3 !=='string' || !title3.trim() || title3.length > 1000){
      errs2.push({message: 'content', field: 'content'})
    }
    if(errs2.length>0)
      {
          res.status(400).send({
            errorsMessages: errs2
          })
          return 
        }
        const nameblog=bloggers.find(v=> v.id===title4)
        if (! nameblog){
        
        res.status(400).send({ errorsMessages: [{ message: 'bloger', field: "bloggerId" }] })
        return
      }
   */
  
   })
 

   postsRouter.post('/', basicAuth, BlogerIdValidation, titleValidation, shortDescriptionValidation,contentValidation,inputValidation,(req : Request, res : Response)=>{
    const postnew=postsRepository.createPosts(req.body.id, req.body.title, req.body.shortDescription, req.body.content)
  if(postnew){
    res.status(201).send(postnew)
  }else{
    res.status(400).send({ errorsMessages: [{ message: 'bloger', field: "bloggerId" }] })
  }
  
    /* let title= req.body.title;
    let title2= req.body.shortDescription;
    let title3= req.body.content;
    let title4= req.body.bloggerId;
    const errs2=[]
  
    if (!title || typeof title !=='string' || !title.trim() || title.length > 30){
      errs2.push({message: 'title', field: 'title'})
    }
    if (!title2 || typeof title2 !=='string' || !title2.trim() || title2.length > 100 ){
      errs2.push({message: 'shortDes', field: 'shortDescription'})
    }
    if (!title3 || typeof title3 !=='string' || !title3.trim() || title3.length > 1000){
      errs2.push({message: 'content', field: 'content'})
    }
    if(errs2.length>0)
      {
          res.status(400).send({
            errorsMessages: errs2
          })
          return
        } */
    
      
   })
  

   postsRouter.delete('/:id',basicAuth, (req : Request, res : Response)=>{
    const isdelete=postsRepository.deletePosts(+req.params.id)
    if (isdelete){
        res.sendStatus(204)
    }else{
        res.sendStatus(404)
    }
   
   })
  
  
