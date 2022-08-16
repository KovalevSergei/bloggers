import { ObjectId } from "mongodb";
import { commentsModel, likeCommentsModel } from "./db";
import {
  commentsDBType,
  commentsDBPostIdType,
  likeComments,
  likeCommentsWithId,
  likePostWithId,
} from "./types";
import { injectable } from "inversify";
import { container } from "../ioc-container";

interface commentReturn {
  items: commentsDBType[];
  totalCount: number;
}
@injectable()
export class CommentsRepository {
  async getComment(id: string): Promise<commentsDBType | null> {
    return commentsModel.findOne(
      { id: id },
      { projection: { _id: 0, postId: 0 } }
    );
  }
  async deleteComment(id: string): Promise<boolean | null> {
    /*  const delComment = await commentsCollection.findOne({ id: id });
    if (delComment === null) {
      return false;
    }
    if (delComment.userId !== userId) {
      return null;
    } else { */
    const result = await commentsModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }
  async updateComment(
    content: string,
    commentId: string,
    userId: string
  ): Promise<boolean | null> {
    const user = await commentsModel.findOne({ id: commentId });
    /*   if (!user) {
      return null;
    }
    if (user.userId === userId) {
      await commentsCollection.updateOne(
        { id: commentId },
        { $set: { content: content } }
      );
      return true;
    } else {
      return false;
    } */
    await commentsModel.updateOne(
      { id: commentId },
      { $set: { content: content } }
    );
    return true;
  }
  async createComment(comment: commentsDBPostIdType): Promise<commentsDBType> {
    await commentsModel.insertMany({ ...comment, _id: new ObjectId() });
    //const {postId,...rest}=comment
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
    };
  }
  async getCommentAll(
    pageSize: number,
    pageNumber: number,
    postId: string
  ): Promise<commentReturn> {
    const totalCount = await commentsModel.countDocuments({
      id: postId,
    });

    const items = await commentsModel
      .find({ id: postId }, { projection: { _id: 0, postId: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();

    return { items: items, totalCount: totalCount };
  }
  async createLikeStatus(likeCommentForm: likeComments): Promise<boolean> {
    const likeInstance = new likeCommentsModel();
    likeInstance.commentsId = likeCommentForm.commentsId;
    likeInstance.userId = likeCommentForm.userId;
    likeInstance.myStatus = likeCommentForm.myStatus;
    likeInstance.addedAt = likeCommentForm.addedAt;
    likeInstance.login = likeCommentForm.login;
    await likeInstance.save();
    return true;
  }
  async findLikeStatus(
    commentsId: string,
    userId: string
  ): Promise<likeCommentsWithId | null> {
    const result = await likeCommentsModel.findOne({
      commentsId: commentsId,
      userId: userId,
    });

    return result;
  }
  async deleteLike(commentsId: string, userId: string): Promise<boolean> {
    const result = await likeCommentsModel.findOne({
      commentsId: commentsId,
      userId: userId,
    });
    if (!result) {
      return false;
    }
    await result.deleteOne();
    return true;
  }
  async getLikeStatus(
    commentsId: string,
    userId: string
  ): Promise<{
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  }> {
    const result = { likesCount: 0, dislikesCount: 0, myStatus: "None" };
    const likesCount = await likeCommentsModel.countDocuments({
      commentsId: commentsId,
      myStatus: "Like",
    });
    result.likesCount = likesCount;
    const disLikes = await likeCommentsModel.countDocuments({
      commentsId: commentsId,
      myStatus: "Dislike",
    });
    result.dislikesCount = disLikes;
    const my = await likeCommentsModel.findOne({
      commentsId: commentsId,
      userId: userId,
    });
    console.log(userId);
    console.log(my, "commentsStatus");
    if (!my) {
      return result;
    } else {
      const a = my;
      result.myStatus = a.myStatus;
    }

    return result;
  }
}
container.bind(CommentsRepository).to(CommentsRepository);
