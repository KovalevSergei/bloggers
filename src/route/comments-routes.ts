import { injectable } from "inversify";
import { Router, Request, Response } from "express";
import { inputValidation } from "../middleware/validation";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "../middleware/auth";
import { CommentsService } from "../domain/comments-servis";
import { jwtService } from "../application/jwt-service";
import { ObjectId } from "mongodb";
export const commentsRouter = Router();
import { UserFind } from "../middleware/FindUser";
import { container } from "../ioc-container"; //import { commentInstance } from "../compositions-root";
import { idPostMistake404 } from "../middleware/idPostMistake404";

const contentValidation = body("content")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 20, max: 300 });
let status = ["None", "Like", "Dislike"];
const likeStatusvalidation = body("likeStatus").isIn(status);

@injectable()
export class CommentsController {
  constructor(protected commentsServis: CommentsService) {}
  async updateContent(req: Request, res: Response) {
    const content = req.body.content;
    const commentId = req.params.commentId;
    const useriD = req.user?.id || "1";
    const contentnew = await this.commentsServis.updateContent(
      content,
      commentId,
      useriD
    );
    res.sendStatus(204);
  }
  async getCommentById(req: Request, res: Response) {
    const commentById = await this.commentsServis.getComment(
      req.params.commentId
    );
    const userId = req.user?.id || "1";

    if (!commentById) {
      res.sendStatus(404);
    } else {
      const likesInformation = await this.commentsServis.getLike(
        req.params.commentId,
        userId
      );
      const result = {
        id: commentById.id,
        content: commentById.content,
        userId: commentById.userId,
        userLogin: commentById.userLogin,
        addedAt: commentById.addedAt,
        likesInfo: likesInformation,
      };
      res.status(200).json(result);
    }
  }
  async deleteComment(req: Request, res: Response) {
    const id = req.params.commentId;
    const isdelete = await this.commentsServis.deleteComment(id);
    res.sendStatus(204);
  }
  async updateLikeComments(req: Request, res: Response) {
    const status = req.body.likeStatus;
    const commentsId = req.params.commentId;
    const commentById = await this.commentsServis.getComment(commentsId);
    if (!commentById) {
      res.sendStatus(404);
    }
    const userId = req.user?.id || "1";
    const result = await this.commentsServis.updateLikeComments(
      commentsId,
      userId,
      status
    );
    res.sendStatus(204);
  }
}
container.bind(CommentsController).to(CommentsController);
const commentInstance = container.resolve(CommentsController);
commentsRouter.put(
  "/:commentId",
  authMiddleware,
  UserFind,
  contentValidation,
  inputValidation,
  commentInstance.updateContent.bind(commentInstance)
);
commentsRouter.get(
  "/:commentId",
  commentInstance.getCommentById.bind(commentInstance)
);

commentsRouter.delete(
  "/:commentId",
  authMiddleware,
  UserFind,
  commentInstance.deleteComment.bind(commentInstance)
);
commentsRouter.put(
  "/:commentId/like-status",
  authMiddleware,
  idPostMistake404,
  likeStatusvalidation,
  inputValidation,
  commentInstance.updateLikeComments.bind(commentInstance)
);
