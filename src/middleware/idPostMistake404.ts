import { Router, Request, Response, NextFunction } from "express";
import { PostsService } from "../domain/posts-servis";
import { container } from "../ioc-container";
import { BloggersRepository } from "../repositories/bloggers-repository";
import { usersModel } from "../repositories/db";
import { PostsRepository } from "../repositories/posts-repository";
import { UsersRepository } from "../repositories/users-repository";

export const idPostMistake404 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;
  const postsService = new PostsService(
    new PostsRepository(),
    new BloggersRepository(),
    new UsersRepository()
  );
  const postById = await postsService.getpostsId(postId);
  if (!postById) {
    res.sendStatus(404);
  } else {
    next();
  }
};
