import { commentsRepository } from "../repositories/comments-repository";
import { userscollection } from "../repositories/db";
import {
  commentsDBType,
  commentDBTypePagination,
  commentsDBPostIdType,
  usersGetDBType,
  UsersDBType,
} from "../repositories/types";
import { UsersServis } from "./Users-servis";

export const commentsServis = {
  async getComment(commentId: string): Promise<commentsDBType[]> {
    const comment = await commentsRepository.getComment(commentId);
    return comment;
  },

  async deleteComment(id: string, userId: string): Promise<boolean | null> {
    const isdelete = await commentsRepository.deleteComment(id, userId);
    return isdelete;
  },
  async updateContent(
    content: string,
    commentId: string,
    userId: string
  ): Promise<boolean | null> {
    const UpdateComment = await commentsRepository.updateComment(
      content,
      commentId,
      userId
    );
    return UpdateComment;
  },
  async createComments(
    userId: string,
    userLogin: string,
    postId: string,
    content: string
  ): Promise<commentsDBType> {
    const commentNew: commentsDBPostIdType = {
      id: Number(new Date()).toString(),
      content: content,
      userId: userId,
      userLogin: userLogin,
      addedAt: new Date().toString(),
      postId: postId,
    };
    const result = await commentsRepository.createComment(commentNew);
    return result;
  },
  async getCommentsPost(
    pageSize: number,
    pageNumber: number,
    postId: string
  ): Promise<commentDBTypePagination | boolean> {
    const { items, totalCount } = await commentsRepository.getCommentAll(
      pageSize,
      pageNumber,
      postId
    );
    if (totalCount === 0) {
      return false;
    } else {
      let pagesCount = Number(Math.ceil(totalCount / pageSize));
      const result: commentDBTypePagination = {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: items,
      };
      return result;
    }
  },
};
