import { ObjectId } from "mongodb";
import { bloggersRepository } from "../repositories/bloggers-repository";
import { postsCollection, bloggersCollection } from "../repositories/db";
import { postsRepository } from "../repositories/posts-repository";
import { postsDBType, postsType } from "../repositories/types";

export const postsServis = {
  async getPosts(pageNumber: number, pageSize: number): Promise<postsDBType> {
    const { items, totalCount } = await postsRepository.getPosts(
      pageNumber,
      pageSize
    );
    let pagesCount = Number(Math.ceil(totalCount / pageSize));
    const result: postsDBType = {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: items,
    };

    return result;
  },

  async getpostsId(id: string): Promise<postsType | null> {
    return await postsRepository.getpostsId(id);
  },

  async updatePostsId(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string
  ): Promise<boolean | null> {
    const nameblog = await bloggersRepository.getBloggersById(bloggerId);

    if (!nameblog) {
      return null;
    } else {
      return await postsRepository.updatePostsId(
        id,
        title,
        shortDescription,
        content
      );
    }
  },
  async createPosts(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string
  ): Promise<boolean | postsType> {
    const nameblog = await bloggersRepository.getBloggersById(bloggerId);

    if (nameblog) {
      const postnew = {
        id: Number(new Date()).toString(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: nameblog.name,
      };

      await postsRepository.createPosts(postnew);
      return postnew;
    } else {
      return false;
    }
  },

  async deletePosts(id: string): Promise<boolean> {
    return postsRepository.deletePosts(id);
  },
};
