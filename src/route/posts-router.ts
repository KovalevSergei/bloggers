import { Router, Request, Response } from "express";
export const postsRouter = Router();
import { inputValidation } from "../middleware/validation";
import { body, validationResult } from "express-validator";
import { title } from "process";
import basicAuth from "../middleware/basicAuth";
import { PostsService } from "../domain/posts-servis";
import { authMiddleware } from "../middleware/auth";
import { CommentsService } from "../domain/comments-servis";
import { container } from "../ioc-container";
import { injectable } from "inversify";
import { userIdMiddleware } from "../middleware/userId";
import { idPostMistake404 } from "../middleware/idPostMistake404";

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
let status = ["None", "Like", "Dislike"];
const likeStatusvalidation = body("likeStatus").isIn(status);

@injectable()
export class PostController {
  constructor(
    protected postsServis: PostsService,
    protected commentsServis: CommentsService
  ) {}
  async getPosts(req: Request, res: Response) {
    const pageNumber = Number(req.query.PageNumber) || 1;
    const pageSize = Number(req.query.PageSize) || 10;
    const getPosts = await this.postsServis.getPosts(pageNumber, pageSize);

    res.status(200).send(getPosts);
  }
  async getpostsId(req: Request, res: Response) {
    const postsid = await this.postsServis.getpostsId(req.params.postsid);
    const userId = req.user?.id || "1";

    if (!postsid) {
      res.sendStatus(404);
    } else {
      const likesInformation = await this.postsServis.getLike(
        req.params.postid,
        userId
      );
      console.log(likesInformation, "status");
      const newestLikes = await this.postsServis.getNewestLikes(
        req.params.postid
      );
      console.log(newestLikes);
      const newestLikesMap = newestLikes.map((v) => ({
        addedAt: v.addedAt,
        userId: v.userId,
        login: v.login,
      }));

      const result = {
        id: postsid.id,
        title: postsid.title,
        shortDescription: postsid.shortDescription,
        content: postsid.content,
        bloggerId: postsid.bloggerId,
        bloggerName: postsid.bloggerName,
        addedAt: postsid.addedAt,
        extendedLikesInfo: {
          likesCount: likesInformation.likesCount,
          dislikesCount: likesInformation.dislikesCount,
          myStatus: likesInformation.myStatus,
          newestLikes: newestLikesMap,
        },
      };
      res.status(200).json(result);
    }
  }
  async updatePostsId(req: Request, res: Response) {
    const postsnew = await this.postsServis.updatePostsId(
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
  }
  async createPosts(req: Request, res: Response) {
    const postnew = await this.postsServis.createPosts(
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
  }
  async deletePosts(req: Request, res: Response) {
    const isdelete = await this.postsServis.deletePosts(req.params.id);
    if (isdelete) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
  async createComments(req: Request, res: Response) {
    const content = req.body.content;
    const userId = req.user?.id;
    const userLogin = req.user?.accountData.login;
    const postId = req.params.postId;

    if (!userId || !userLogin) {
      return res.sendStatus(401);
    }

    const findPost = await this.postsServis.getpostsId(postId);
    if (!findPost) {
      res.sendStatus(404);
    } else {
      const newComment = await this.commentsServis.createComments(
        userId,
        userLogin,
        postId,
        content
      );
      res.status(201).send(newComment);
    }
  }
  async getCommentsPost(req: Request, res: Response) {
    const pageSize = req.query.PageSize ? Number(req.query.PageSize) : 10;
    const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1;
    const postId = req.params.postId;
    const post = await this.postsServis.getpostsId(postId);
    if (!post) {
      return res.sendStatus(404);
    }
    const getComment = await this.commentsServis.getCommentsPost(
      pageSize,
      pageNumber,
      postId
    );

    res.status(200).send(getComment);
  }
  async updateLikePosts(req: Request, res: Response) {
    const postId = req.params.postId;
    const status = req.body.likeStatus;
    const userId = req.user?.id || "1";
    const postById = await this.postsServis.getpostsId(postId);
    if (!postById) {
      res.sendStatus(404);
    }
    const result = await this.postsServis.updateLikePost(
      postId,
      userId,
      status
    );
    res.sendStatus(204);
  }
}
container.bind(PostController).to(PostController);
const postControllerInstans = container.resolve(PostController);

postsRouter.get(
  "/",
  postControllerInstans.getPosts.bind(postControllerInstans)
);

postsRouter.get(
  "/:postsid",
  userIdMiddleware,
  postControllerInstans.getpostsId.bind(postControllerInstans)
);

postsRouter.put(
  "/:id",
  basicAuth,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidation,
  postControllerInstans.updatePostsId.bind(postControllerInstans)
);
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

postsRouter.post(
  "/",
  basicAuth,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidation,
  postControllerInstans.createPosts.bind(postControllerInstans)
);

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

postsRouter.delete(
  "/:id",
  basicAuth,
  postControllerInstans.deletePosts.bind(postControllerInstans)
);

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
  postControllerInstans.createComments.bind(postControllerInstans)
);
postsRouter.get(
  "/:postId/comments",
  postControllerInstans.getCommentsPost.bind(postControllerInstans)
);
postsRouter.put(
  "/:postId/like-status",
  authMiddleware,
  idPostMistake404,
  likeStatusvalidation,
  inputValidation,
  postControllerInstans.updateLikePosts.bind(postControllerInstans)
);
