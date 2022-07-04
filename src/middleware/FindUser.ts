import { Router, Request, Response, NextFunction } from "express";
import { UsersServis } from "../domain/Users-servis";
import { commentsCollection } from "../repositories/db";

export const UserFind = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id || "1";
  const id = req.params.commentId;
  const Comment = await commentsCollection.findOne({ id: id });
  console.log(Comment);
  if (!Comment) {
    res.sendStatus(404);
    return;
  }
  if (Comment.userId !== userId) {
    res.sendStatus(403);
    return;
  } else {
    next();
  }
};
