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
commentsRouter.get("/:id", async (req: Request, res: Response) => {
  const commentId = await commentsServis.getComment(req.params.id);
  console.log("proverkaA", req.params.id, commentId);
  if (!commentId) {
    res.sendStatus(404);
  } else {
    res.status(200).json(commentId);
  }
});

commentsRouter.delete(
  "/:id",
  authMiddleware,
  UserFind,
  async (req: Request, res: Response) => {
    const userId = req.user?.id || "1";
    const id = req.params.id;
    const isdelete = await commentsServis.deleteComment(id, userId);
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
