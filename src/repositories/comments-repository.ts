import { ObjectId } from "mongodb";
import { commentsCollection } from "./db";
import { commentsDBType, commentsDBPostIdType } from "./types";

interface commentReturn {
  items: commentsDBType[];
  totalCount: number;
}

export const commentsRepository = {
  async getComment(id: string): Promise<commentsDBType | null> {
    return commentsCollection.findOne(
      { id: id },
      { projection: { _id: 0, postId: 0 } }
    );
  },
  async deleteComment(id: string): Promise<boolean | null> {
    /*  const delComment = await commentsCollection.findOne({ id: id });
    if (delComment === null) {
      return false;
    }
    if (delComment.userId !== userId) {
      return null;
    } else { */
    const result = await commentsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
  async updateComment(
    content: string,
    commentId: string,
    userId: string
  ): Promise<boolean | null> {
    const user = await commentsCollection.findOne({ id: commentId });
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
    await commentsCollection.updateOne(
      { id: commentId },
      { $set: { content: content } }
    );
    return true;
  },
  async createComment(comment: commentsDBPostIdType): Promise<commentsDBType> {
    await commentsCollection.insertOne({ ...comment, _id: new ObjectId() });
    //const {postId,...rest}=comment
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
    };
  },
  async getCommentAll(
    pageSize: number,
    pageNumber: number,
    postId: string
  ): Promise<commentReturn> {
    const totalCount = await commentsCollection.countDocuments({
      postId: postId,
    });

    const items = await commentsCollection
      .find({ postId: postId }, { projection: { _id: 0, postId: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();

    return { items: items, totalCount: totalCount };
  },
};
