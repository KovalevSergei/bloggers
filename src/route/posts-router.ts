import { Router, Request, Response } from "express";
export const postsRouter = Router();
import { inputValidation } from "../middleware/validation";
import { body, validationResult } from "express-validator";
import { title } from "process";
import basicAuth from "../middleware/basicAuth";
import { postsServis } from "../domain/posts-servis";
import { authMiddleware } from "../middleware/auth";
import { commentsServis } from "../domain/comments-servis";
export { titleValidation, shortDescriptionValidation, contentValidation };

const titleValidation = body("title")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 1, max: 30 })
  .isString();
const shortDescriptionValidation = body("shortDescription")
  .exists()
  .trim()
  .notEmpty()
  .isString()
  .isLength({ min: 1, max: 100 });
const contentValidation = body("content")
  .exists()
  .isString()
  .trim()
  .notEmpty()
  .isLength({ min: 1, max: 1000 });

postsRouter.get("/", async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.PageNumber) || 1;
  const pageSize = Number(req.query.PageSize) || 10;
  const getPosts = await postsServis.getPosts(pageNumber, pageSize);

  res.status(200).send(getPosts);
});

postsRouter.get("/:postsid", async (req: Request, res: Response) => {
  const postsid = await postsServis.getpostsId(req.params.postsid);
  if (!postsid) {
    res.sendStatus(404);
  } else {
    res.status(200).json(postsid);
  }
});

postsRouter.put(
  "/:id",
  basicAuth,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const postsnew = await postsServis.updatePostsId(
      req.params.id,
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.bloggerId
    );
    if (postsnew === false) {
      res.sendStatus(404);
    } else if (postsnew === null) {
      res
        .status(400)
        .send({ errorsMessages: [{ message: "bloger", field: "bloggerId" }] });
    } else {
      res.status(204).send(postsnew);
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
  }
);

postsRouter.post(
  "/",
  basicAuth,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const postnew = await postsServis.createPosts(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.bloggerId
    );
    if (postnew) {
      res.status(201).send(postnew);
    } else {
      res
        .status(400)
        .send({ errorsMessages: [{ message: "bloger", field: "bloggerId" }] });
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
  }
);

postsRouter.delete("/:id", basicAuth, async (req: Request, res: Response) => {
  const isdelete = await postsServis.deletePosts(req.params.id);
  if (isdelete) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

/*   export const bloggerIdValidation = body('bloggerId')
   .trim().notEmpty().withMessage('Missing a required parameter')
   .custom(async (value, {req}) => {
       const isBloggerExists = await postsService.isUserExists(+req.body.bloggerId)
       if (!isBloggerExists) {
           throw new Error(`Blogger with id ${req.body.bloggerId} doesn't exist`);
       }
       return true;
   }); */
//comments

const contentValidationComments = body("content")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 20, max: 300 });

postsRouter.post(
  "/:postId/comments",
  authMiddleware,
  contentValidationComments,
  inputValidation,
  async (req: Request, res: Response) => {
    const content = req.body.content;
    const userId = req.user?.id || "1";
    const userLogin = req.user?.login || "1";
    const postId = req.params.postId;

    const findPost = await postsServis.getpostsId(postId);
    if (findPost === null) {
      res.sendStatus(404);
    } else {
      const newComment = await commentsServis.createComments(
        userId,
        userLogin,
        postId,
        content
      );

      res.status(201).send(newComment);
    }
  }
);
postsRouter.get("/:postId/comments", async (req: Request, res: Response) => {
  const pageSize: number = Number(req.query.PageSize) || 10;
  const pageNumber = Number(req.query.PageNumber) || 1;
  const postId = req.params.postId;

  const getComment = await commentsServis.getCommentsPost(
    pageSize,
    pageNumber,
    postId
  );

  if (getComment === false) {
    return res.sendStatus(404);
  }

  res.send(getComment);
});
