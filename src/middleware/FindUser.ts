import { Router, Request, Response, NextFunction } from "express";
import { commentsModel } from "../repositories/db";

export const UserFind = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const id = req.params.commentId;
  if (!userId) {
    res.sendStatus(401);
    return;
  }
  const Comment = await commentsModel.findOne({ id: id });
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
