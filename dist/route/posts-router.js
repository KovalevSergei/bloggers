"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repositories/posts-repository");
exports.postsRouter = (0, express_1.Router)();
const validation_1 = require("../middleware/validation");
const express_validator_1 = require("express-validator");
const basicAuth_1 = require("../middleware/basicAuth");
const titleValidation = (0, express_validator_1.body)("title").trim().isLength({ min: 1, max: 30 }).isString();
const shortDescriptionValidation = (0, express_validator_1.body)("shortDescription").trim().isString().isLength({ min: 1, max: 100 });
const contentValidation = (0, express_validator_1.body)("title").isString().trim().isLength({ min: 1, max: 1000 });
exports.postsRouter.get('/', (req, res) => {
    const getPosts = posts_repository_1.postsRepository.getPosts();
    res.send(getPosts);
    res.sendStatus(200);
});
exports.postsRouter.get('/:id', (req, res) => {
    const postsid = posts_repository_1.postsRepository.getpostsId(+req.params.id);
    if (!postsid) {
        res.sendStatus(404);
        res.sendStatus(400);
    }
    else {
        res.json(postsid);
        res.sendStatus(200);
    }
});
exports.postsRouter.put('/:id', titleValidation, shortDescriptionValidation, contentValidation, validation_1.inputValidation, (req, res) => {
    const postsnew = posts_repository_1.postsRepository.updatePostsId(+req.body.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId);
    if (postsnew) {
        res.status(204).send(postsnew);
        res.json(postsnew);
    }
    else {
        res.status(400).send({ errorsMessages: [{ message: 'bloger', field: "bloggerId" }] });
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
});
exports.postsRouter.use(basicAuth_1.basicAuthMiddlewareBuilder);
exports.postsRouter.post('/posts', titleValidation, shortDescriptionValidation, contentValidation, validation_1.inputValidation, (req, res) => {
    const postnew = posts_repository_1.postsRepository.createPosts(+req.body.id, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId);
    if (postnew) {
        res.status(201).send(postnew);
    }
    else {
        res.status(400).send({ errorsMessages: [{ message: 'bloger', field: "bloggerId" }] });
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
});
exports.postsRouter.delete('/:id', (req, res) => {
    const isdelete = posts_repository_1.postsRepository.deletePosts(+req.params.id);
    if (isdelete) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
//# sourceMappingURL=posts-router.js.map