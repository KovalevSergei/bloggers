import { Router, Request, Response } from "express";
import { inputValidation } from "../middleware/validation";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { commentsServis } from "../domain/comments-servis";
import { jwtService } from "../application/jwt-service";
import { UsersServis } from "../domain/Users-servis";
import { ObjectId } from "mongodb";
export const commentsRouter = Router();
import { UserFind } from "../middleware/FindUser";

const contentValidation = body("content")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 20, max: 300 });

commentsRouter.put(
  "/:commentId",
  authMiddleware,
  UserFind,
  contentValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const content = req.body.content;
    const commentId = req.params.commentId;
    const useriD = req.user?.id || "1";
    const contentnew = await commentsServis.updateContent(
      content,
      commentId,
      useriD
    );
    res.sendStatus(204);
    /*  if (contentnew === null) {
      return res.sendStatus(404);
    }
    if (contentnew === true) {
      res.sendStatus(204);
    } else {
      res.sendStatus(403);
    } */
  }
);
commentsRouter.get("/:commentId", async (req: Request, res: Response) => {
  const commentById = await commentsServis.getComment(req.params.commentId);

  if (!commentById) {
    res.sendStatus(404);
  } else {
    res.status(200).json(commentById);
  }
});

commentsRouter.delete(
  "/:commentId",
  authMiddleware,
  UserFind,
  async (req: Request, res: Response) => {
    const id = req.params.commentId;
    const isdelete = await commentsServis.deleteComment(id);
    res.sendStatus(204);
    /* if (isdelete === null) {
      res.sendStatus(403);
      return;
    }
    if (isdelete) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    } */
  }
);
