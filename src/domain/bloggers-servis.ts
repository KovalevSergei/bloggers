import { injectable } from "inversify";
import {
  bloggersType,
  bloggersDBType,
  postsDBType,
  postsType,
} from "../repositories/types";
import { BloggersRepository } from "../repositories/bloggers-repository";
import { container } from "../ioc-container";
import { PostsService } from "./posts-servis";
import { PostsRepository } from "../repositories/posts-repository";
@injectable()
export class BloggersService {
  constructor(
    protected bloggersRepository: BloggersRepository,
    protected postsServis: PostsService,
    protected postsRepository: PostsRepository
  ) {}
  async getBloggers(
    pageSize: number,
    pageNumber: number,
    SearhName: string
  ): Promise<bloggersDBType> {
    const { items, totalCount } = await this.bloggersRepository.getBloggers(
      pageSize,
      pageNumber,
      SearhName
    );
    let items2 = items.map((v) => ({
      id: v.id,
      name: v.name,
      youtubeUrl: v.youtubeUrl,
    }));

    let pagesCount = Number(Math.ceil(totalCount / pageSize));
    const result: bloggersDBType = new bloggersDBType(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      items2
    );
    return result;
  }

  async getBloggersById(id: string): Promise<bloggersType | null> {
    const bloggers = await this.bloggersRepository.getBloggersById(id);
    if (!bloggers) {
      return null;
    } else {
      const bloggers2 = {
        id: bloggers.id,
        name: bloggers.name,
        youtubeUrl: bloggers.youtubeUrl,
      };
      return bloggers2;
    }
  }

  async deleteBloggersById(id: string): Promise<boolean> {
    return this.bloggersRepository.deleteBloggersById(id);
  }

  async createBloggers(
    name: string,
    youtubeUrl: string
  ): Promise<bloggersType> {
    const bloggersnew = {
      id: Number(new Date()).toString(),
      name: name,
      youtubeUrl: youtubeUrl,
    };

    const result = this.bloggersRepository.createBloggers(bloggersnew);

    return result;
  }

  async updateBloggers(
    id: string,
    name: string,
    youtubeUrl: string
  ): Promise<boolean> {
    return await this.bloggersRepository.updateBloggers(id, name, youtubeUrl);
  }

  async getBloggersPost(
    bloggerId: string,
    pageSize: number,
    pageNumber: number,
    userId: string
  ): Promise<postsDBType | boolean> {
    const { items, totalCount } = await this.bloggersRepository.getBloggersPost(
      bloggerId,
      pageSize,
      pageNumber
    );

    /*    const postIds = items.map(p => p.id)
const likes= await this.postsRepository.getLikesBloggersPost(postIds)
const dislikes=await this.postsRepository.getDislikeBloggersPost(postIds)
    items.forEach(p => {
      const postLikes = likes.filter(l => l.postId === p.id)

    }) */

    const items2 = [];
    if (totalCount === 0) {
      return false;
    } else {
      for (let i = 0; i < totalCount; i++) {
        const postItt = items[i];
        const postId = postItt.id;
        const likesInformation = await this.postsServis.getLike(postId, userId);
        const newestLikes = await this.postsServis.getNewestLikes(postId);
        const newestLikesMap = newestLikes.map(
          (v: { addedAt: any; userId: any; login: any }) => ({
            addedAt: v.addedAt,
            userId: v.userId,
            login: v.login,
          })
        );
        const a = {
          id: items[i].id,
          title: items[i].title,
          shortDescription: items[i].shortDescription,
          content: items[i].content,
          bloggerId: items[i].bloggerId,
          bloggerName: items[i].bloggerName,
          addedAt: items[i].addedAt,
          extendedLikesInfo: {
            likesCount: likesInformation.likesCount,
            dislikesCount: likesInformation.dislikesCount,
            myStatus: likesInformation.myStatus,
            newestLikes: newestLikesMap,
          },
        };
        items2.push(a);
      }
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
  }

  async createBloggersPost(
    bloggerId: string,
    title: string,
    shortDescription: string,
    content: string
  ): Promise<postsType | boolean> {
    const findName = await this.bloggersRepository.getBloggersById(bloggerId);

    if (!findName) {
      return false;
    } else {
      const postsnew = {
        id: Number(new Date()).toString(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: bloggerId,
        bloggerName: findName.name,
        addedAt: new Date(),
      };

      const result = await this.bloggersRepository.createBloggersPost(postsnew);

      return result;
    }
  }
}
container.bind(BloggersService).to(BloggersService);
