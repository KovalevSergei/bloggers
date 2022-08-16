import { injectable } from "inversify";
import { Router, Request, Response } from "express";
import { BloggersService } from "../domain/bloggers-servis";
export const bloggersRouter = Router();
import { body, validationResult } from "express-validator";
import { inputValidation } from "../middleware/validation";
import { basicAuth } from "../middleware/basicAuth";
import {
  bloggersType,
  bloggersDBType,
  postsDBType,
  postsType,
} from "../repositories/types";

//import { bloggersControllerInstans } from "../compositions-root";
import { container } from "../ioc-container";
import {
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
} from "../route/posts-router";
import { BloggersRepository } from "../repositories/bloggers-repository";
import { userIdMiddleware } from "../middleware/userId";

const maxNameLength = 15;
const urlRegExp =
  "^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$";
const nameValidation = body("name")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 1, max: 15 })
  .withMessage(`Name should be less than ${maxNameLength} symbols`);
const youtubeUrlValidation = body("youtubeUrl")
  .exists()
  .trim()
  .notEmpty()
  .isString()
  .matches(urlRegExp)
  .isLength({ min: 1, max: 100 });

@injectable()
export class BloggersController {
  //constructor
  //(@injectable(BloggersService) protected bloggersServis: BloggersService) {}
  constructor(protected bloggersServis: BloggersService) {}
  async getBloggers(req: Request, res: Response) {
    const pageSize: number = Number(req.query.PageSize) || 10;
    const pageNumber = Number(req.query.PageNumber) || 1;
    const SearhName = req.query.SearchNameTerm || "";
    if (typeof SearhName === "string" || !SearhName) {
      const getBloggers = await this.bloggersServis.getBloggers(
        pageSize,
        pageNumber,
        SearhName
      );

      return res.send(getBloggers);
    }
    res.sendStatus(400);
  }
  async getBloggersById(req: Request, res: Response) {
    const blog = await this.bloggersServis.getBloggersById(
      req.params.bloggersid
    );
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.sendStatus(404);
    }
  }
  async deleteBloggersById(req: Request, res: Response) {
    const bloggerdel = await this.bloggersServis.deleteBloggersById(
      req.params.id
    );
    if (bloggerdel) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
  async createBloggers(req: Request, res: Response) {
    const bloggersnew = await this.bloggersServis.createBloggers(
      req.body.name,
      req.body.youtubeUrl
    );
    if (bloggersnew) {
      res.status(201).send(bloggersnew);
    }
  }
  async updateBloggers(req: Request, res: Response) {
    const bloggersnew = await this.bloggersServis.updateBloggers(
      req.params.id,
      req.body.name,
      req.body.youtubeUrl
    );

    if (bloggersnew) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
  async getBloggersPost(req: Request, res: Response) {
    const pageSize: number = Number(req.query.PageSize) || 10;
    const pageNumber = Number(req.query.PageNumber) || 1;
    const postId = req.params.postId;
    const userId = req.user?.id || "1";

    const getPostBlogger = await this.bloggersServis.getBloggersPost(
      postId,
      pageSize,
      pageNumber,
      userId
    );
    if (getPostBlogger === false) {
      res.status(404).send("If specific blogger is not exists");
    } else {
      return res.send(getPostBlogger);
    }
  }

  async createBloggersPost(req: Request, res: Response) {
    const bloggersnew = await this.bloggersServis.createBloggersPost(
      req.params.bloggerId,
      req.body.title,
      req.body.shortDescription,
      req.body.content
    );

    if (bloggersnew === false) {
      res.status(404).send("If specific blogger doesn't exists");
    } else {
      const a = bloggersnew as postsType;
      const result = {
        id: a.id,
        title: a.title,
        shortDescription: a.shortDescription,
        content: a.content,
        bloggerId: a.bloggerId,
        bloggerName: a.bloggerName,
        addedAt: a.addedAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
          newestLikes: [],
        },
      };
      res.status(201).send(result);
    }
  }
}
container.bind<BloggersController>(BloggersController).to(BloggersController);
const bloggersControllerInstans = container.resolve(BloggersController);
bloggersRouter.get(
  "/",
  bloggersControllerInstans.getBloggers.bind(bloggersControllerInstans)
);

bloggersRouter.get(
  "/:bloggersid",
  bloggersControllerInstans.getBloggersById.bind(bloggersControllerInstans)
);

bloggersRouter.delete(
  "/:id",
  basicAuth,
  bloggersControllerInstans.deleteBloggersById.bind(bloggersControllerInstans)
);
bloggersRouter.post(
  "/",
  basicAuth,
  nameValidation,
  youtubeUrlValidation,
  inputValidation,
  bloggersControllerInstans.createBloggers.bind(bloggersControllerInstans)
);

bloggersRouter.put(
  "/:id",
  basicAuth,
  nameValidation,
  youtubeUrlValidation,
  inputValidation,
  bloggersControllerInstans.updateBloggers.bind(bloggersControllerInstans)
);

bloggersRouter.get(
  "/:postId/posts",
  userIdMiddleware,
  bloggersControllerInstans.getBloggersPost.bind(bloggersControllerInstans)
);

bloggersRouter.post(
  "/:bloggerId/posts",
  basicAuth,
  userIdMiddleware,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidation,
  bloggersControllerInstans.createBloggersPost.bind(bloggersControllerInstans)
);
