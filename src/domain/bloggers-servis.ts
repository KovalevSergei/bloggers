import { ObjectId } from "mongodb";
import { bloggersCollection, postsCollection } from "../repositories/db";
import {
  bloggersType,
  bloggersDBType,
  postsDBType,
  postsType,
} from "../repositories/types";

import { bloggersRepository } from "../repositories/bloggers-repository";
import { postsRepository } from "../repositories/posts-repository";
import { postsRouter } from "../route/posts-router";

export const bloggersServis = {
  async getBloggers(
    pageSize: number,
    pageNumber: number,
    SearhName: string | null
  ): Promise<bloggersDBType> {
    const { items, totalCount } = await bloggersRepository.getBloggers(
      pageSize,
      pageNumber,
      SearhName
    );

    let pagesCount = Number(Math.ceil(totalCount / pageSize));
    const result: bloggersDBType = {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: items,
    };
    return result;
  },

  async getBloggersById(id: number): Promise<bloggersType | null> {
    return bloggersRepository.getBloggersById(id);
  },

  async deleteBloggersById(id: number): Promise<boolean> {
    return bloggersRepository.deleteBloggersById(id);
  },

  async createBloggers(
    name: string,
    youtubeUrl: string
  ): Promise<bloggersType> {
    const bloggersnew = {
      id: +new Date(),
      name: name,
      youtubeUrl: youtubeUrl,
    };

    const result = bloggersRepository.createBloggers(bloggersnew);

    return result;
  },

  async updateBloggers(
    id: number,
    name: string,
    youtubeUrl: string
  ): Promise<boolean> {
    return await bloggersRepository.updateBloggers(id, name, youtubeUrl);
  },

  async getBloggersPost(
    bloggerId: number,
    pageSize: number,
    pageNumber: number
  ): Promise<postsDBType | boolean> {
    const { items, totalCount } = await bloggersRepository.getBloggersPost(
      bloggerId,
      pageSize,
      pageNumber
    );
    if (totalCount === 0) {
      return false;
    } else {
      let pagesCount = Number(Math.ceil(totalCount / pageSize));
      const result: postsDBType = {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: items,
      };
      return result;
    }
  },

  async createBloggersPost(
    bloggerId: number,
    title: string,
    shortDescription: string,
    content: string
  ): Promise<postsType | boolean> {
    const findName = await bloggersRepository.getBloggersById(bloggerId);

    if (!findName) {
      return false;
    } else {
      const postsnew = {
        id: +new Date(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: findName.name,
      };

      const result = await bloggersRepository.createBloggersPost(postsnew);

      return result;
    }
  },
};