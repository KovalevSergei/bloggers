import { Router, Request, Response } from "express";
import { inputValidation } from "../middleware/validation";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { commentsServis } from "../domain/comments-servis";
import { jwtService } from "../application/jwt-service";
import { UsersServis } from "../domain/Users-servis";
import { ObjectId } from "mongodb";
export const commentsRouter = Router();

const contentValidation = body("content")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 20, max: 300 });

commentsRouter.put(
  "/:commentId",
  authMiddleware,
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
    if (contentnew === null) {
      return res.sendStatus(404);
    }
    if (contentnew === true) {
      res.sendStatus(204);
    } else {
      res
        .status(403)
        .send(
          "try to update or delete the entity that was created by another user"
        );
    }
  }
);
commentsRouter.get("/:id", async (req: Request, res: Response) => {
  const commentId = await commentsServis.getComment(req.params.id);
  if (commentId.length === 0) {
    res.sendStatus(404);
  } else {
    res.status(200).json(commentId);
  }
});

commentsRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.user?.id || "1";
    const isdelete = await commentsServis.deleteComment(req.params.id, userId);
    if (isdelete === null) {
      res.sendStatus(403);
    }
    if (isdelete) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);
