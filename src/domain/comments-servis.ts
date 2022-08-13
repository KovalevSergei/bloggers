import { CommentsRepository } from "../repositories/comments-repository";
import { injectable } from "inversify";
import {
  commentsDBType,
  commentDBTypePagination,
  commentsDBPostIdType,
  usersGetDBType,
  UsersDBType,
  likeComments,
} from "../repositories/types";
import { container } from "../ioc-container";
import { UsersRepository } from "../repositories/users-repository";
@injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository
  ) {}
  async getComment(id: string): Promise<commentsDBType | null> {
    const comment = await this.commentsRepository.getComment(id);
    return comment;
  }

  async deleteComment(id: string): Promise<boolean | null> {
    const isdelete = await this.commentsRepository.deleteComment(id);
    return isdelete;
  }
  async updateContent(
    content: string,
    commentId: string,
    userId: string
  ): Promise<boolean | null> {
    const UpdateComment = await this.commentsRepository.updateComment(
      content,
      commentId,
      userId
    );
    return UpdateComment;
  }
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
    const result = await this.commentsRepository.createComment(commentNew);
    return result;
  }
  async getCommentsPost(
    pageSize: number,
    pageNumber: number,
    postId: string
  ): Promise<commentDBTypePagination | boolean> {
    const { items, totalCount } = await this.commentsRepository.getCommentAll(
      pageSize,
      pageNumber,
      postId
    );

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
  async updateLikeComments(
    commentsId: string,
    userId: string,
    myStatus: string
  ): Promise<boolean> {
    const findLike = await this.commentsRepository.findLikeStatus(
      commentsId,
      userId
    );
    const login = await this.usersRepository.getUserById(userId);
    const login2 = login as UsersDBType;
    if (!findLike && myStatus != "None") {
      const likeCommentForm = new likeComments(
        commentsId,
        userId,
        login2.accountData.login,
        myStatus,
        new Date()
      );
      const result = await this.commentsRepository.createLikeStatus(
        likeCommentForm
      );
      return true;
    }
    if (findLike && myStatus === "None") {
      await this.commentsRepository.deleteLike(commentsId, userId);
      return true;
    }

    await this.commentsRepository.deleteLike(commentsId, userId);
    if (findLike?.myStatus === myStatus) {
      return true;
    } else {
      const login = await this.usersRepository.getUserById(userId);
      const login2 = login as UsersDBType;
      const likeCommentForm = new likeComments(
        commentsId,
        userId,
        login2.accountData.login,
        myStatus,
        new Date()
      );
      const result = await this.commentsRepository.createLikeStatus(
        likeCommentForm
      );
    }

    return true;
  }
  async getLike(
    commentsId: string,
    userId: string
  ): Promise<{ likesCount: number; dislikesCount: number; myStatus: string }> {
    const result = await this.commentsRepository.getLikeStatus(
      commentsId,
      userId
    );
    return result;
  }
}
container.bind(CommentsService).to(CommentsService);
