import { Router, Request, Response, NextFunction } from "express";
import { CommentsService } from "../domain/comments-servis";

import { BloggersRepository } from "../repositories/bloggers-repository";
import { CommentsRepository } from "../repositories/comments-repository";

import { PostsRepository } from "../repositories/posts-repository";
import { UsersRepository } from "../repositories/users-repository";

export const idCommentsMistake404 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentsServis = new CommentsService(
    new CommentsRepository(),
    new UsersRepository()
  );

  const commentsId = req.params.commentId;
  const commentById = await commentsServis.getComment(commentsId);
  if (!commentById) {
    res.sendStatus(404);
  } else {
    next();
  }
};
