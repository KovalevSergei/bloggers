import { ObjectId } from "mongodb";
import { BloggersRepository } from "../repositories/bloggers-repository";
import { PostsRepository } from "../repositories/posts-repository";
import {
  likePosts,
  likePostWithId,
  postsDBType,
  postsType,
  UsersDBType,
} from "../repositories/types";
import { UsersRepository } from "../repositories/users-repository";
import { injectable } from "inversify";
import { container } from "../ioc-container";

@injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected bloggersRepository: BloggersRepository,
    protected usersRepository: UsersRepository
  ) {}
  async getPosts(pageNumber: number, pageSize: number): Promise<postsDBType> {
    const { items, totalCount } = await this.postsRepository.getPosts(
      pageNumber,
      pageSize
    );

    let items2 = items.map((v) => ({
      id: v.id,
      title: v.title,
      shortDescription: v.shortDescription,
      content: v.content,
      bloggerId: v.bloggerId,
      bloggerName: v.bloggerName,
      addedAt: v.addedAt,
    }));
    let pagesCount = Number(Math.ceil(totalCount / pageSize));
    const result: postsDBType = {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: items2,
    };

    return result;
  }

  async getpostsId(id: string): Promise<postsType | null> {
    const v = await this.postsRepository.getpostsId(id);
    if (!v) {
      return null;
    }
    const result2 = {
      id: v.id,
      title: v.title,
      shortDescription: v.shortDescription,
      content: v.content,
      bloggerId: v.bloggerId,
      bloggerName: v.bloggerName,
      addedAt: v.addedAt,
    };
    return result2;
  }

  async updatePostsId(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string
  ): Promise<boolean | null> {
    const nameblog = await this.bloggersRepository.getBloggersById(bloggerId);

    if (!nameblog) {
      return null;
    } else {
      return await this.postsRepository.updatePostsId(
        id,
        title,
        shortDescription,
        content
      );
    }
  }
  async createPosts(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string
  ): Promise<postsType | boolean> {
    const nameblog = await this.bloggersRepository.getBloggersById(bloggerId);

    if (nameblog) {
      const postnew = {
        id: Number(new Date()).toString(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: nameblog.name,
        addedAt: new Date(),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
          newestLikes: [],
        },
      };

      await this.postsRepository.createPosts(postnew);
      return postnew;
    } else {
      return false;
    }
  }

  async deletePosts(id: string): Promise<boolean> {
    return this.postsRepository.deletePosts(id);
  }
  async updateLikePost(
    postId: string,
    userId: string,
    status: string
  ): Promise<boolean> {
    const findLike = await this.postsRepository.findLikeStatus(postId, userId);
    const login = await this.usersRepository.getUserById(userId);
    const login2 = login as UsersDBType;
    if (!findLike && status != "None") {
      const likePostForm = new likePosts(
        postId,
        userId,
        login2.accountData.login,
        status,
        new Date()
      );
      const result = await this.postsRepository.createLikeStatus(likePostForm);
      return true;
    }
    if (findLike && status === "None") {
      await this.postsRepository.deleteLike(postId, userId);
      return true;
    }

    await this.postsRepository.deleteLike(postId, userId);
    if (findLike?.myStatus === status) {
      return true;
    } else {
      const login = await this.usersRepository.getUserById(userId);
      const login2 = login as UsersDBType;
      const likePostForm = new likePosts(
        postId,
        userId,
        login2.accountData.login,
        status,
        new Date()
      );
      const result = await this.postsRepository.createLikeStatus(likePostForm);
    }
    return true;
  }
  async getLike(
    postId: string,
    userId: string
  ): Promise<{ likesCount: number; dislikesCount: number; myStatus: string }> {
    const result = await this.postsRepository.getLikeStatus(postId, userId);
    return result;
  }
  async getNewestLikes(postId: string): Promise<likePostWithId[]> {
    const result = await this.postsRepository.getNewestLikes(postId);
    return result;
  }
}

container.bind(PostsService).to(PostsService);
