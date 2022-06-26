import { Router, Request, Response } from "express";
import { bloggersServis } from "../domain/bloggers-servis";
export const bloggersRouter = Router();
import { body, validationResult } from "express-validator";
import { inputValidation } from "../middleware/validation";
import basicAuth from "../middleware/basicAuth";
import {
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
} from "../route/posts-router";

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

bloggersRouter.get("/", async (req: Request, res: Response) => {
  const pageSize: number = Number(req.query.PageSize) || 10;
  const pageNumber = Number(req.query.PageNumber) || 1;
  const SearhName = req.query.SearchNameTerm || "";
  console.log(pageSize, pageNumber);
  if (typeof SearhName === "string" || !SearhName) {
    const getBloggers = await bloggersServis.getBloggers(
      pageSize,
      pageNumber,
      SearhName
    );

    return res.send(getBloggers);
  }
  res.sendStatus(400);
});

bloggersRouter.get("/:bloggersid", async (req: Request, res: Response) => {
  const blog = await bloggersServis.getBloggersById(+req.params.bloggersid);
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.sendStatus(404);
  }
});

bloggersRouter.delete(
  "/:id",
  basicAuth,
  async (req: Request, res: Response) => {
    const bloggerdel = await bloggersServis.deleteBloggersById(+req.params.id);
    if (bloggerdel) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);
bloggersRouter.post(
  "/",
  basicAuth,
  nameValidation,
  youtubeUrlValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const bloggersnew = await bloggersServis.createBloggers(
      req.body.name,
      req.body.youtubeUrl
    );
    if (bloggersnew) {
      res.status(201).send(bloggersnew);
    }
  }
);

bloggersRouter.put(
  "/:id",
  basicAuth,
  nameValidation,
  youtubeUrlValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const bloggersnew = await bloggersServis.updateBloggers(
      +req.params.id,
      req.body.name,
      req.body.youtubeUrl
    );

    if (bloggersnew) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

bloggersRouter.get("/:bloggerId/posts", async (req: Request, res: Response) => {
  const pageSize: number = Number(req.query.PageSize) || 10;
  const pageNumber = Number(req.query.PageNumber) || 1;
  const bloggerId = +req.params.bloggerId;

  const getPostBlogger = await bloggersServis.getBloggersPost(
    bloggerId,
    pageSize,
    pageNumber
  );
  if (getPostBlogger === false) {
    res.status(404).send("If specific blogger is not exists");
  } else {
    return res.send(getPostBlogger);
  }
});

bloggersRouter.post(
  "/:bloggerId/posts",
  basicAuth,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const bloggersnew = await bloggersServis.createBloggersPost(
      +req.params.bloggerId,
      req.body.title,
      req.body.shortDescription,
      req.body.content
    );
    if (bloggersnew) {
      res.status(201).send(bloggersnew);
    } else {
      res.status(404).send("If specific blogger doesn't exists");
    }
  }
);
