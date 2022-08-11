import { injectable } from "inversify";
import { ObjectId } from "mongodb";
//import { bloggersCollection, postsCollection } from "./db";
import { bloggersType, postsDBType, postsType } from "./types";
import { bloggersModel, postsModel } from "./db";
import { container } from "../ioc-container";

interface bloggersReturn {
  items: bloggersType[];
  totalCount: number;
}
interface postsReturn {
  items: postsType[];
  totalCount: number;
}
@injectable()
export class BloggersRepository {
  async getBloggers(
    pageSize: number,
    pageNumber: number,
    SearhName: string
  ): Promise<bloggersReturn> {
    const totalCount = await bloggersModel.countDocuments({
      name: { $regex: SearhName },
    });

    const items = await bloggersModel
      .find({ name: { $regex: SearhName } }, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();

    return {
      totalCount: totalCount,
      items: items,
    };
  }

  async getBloggersById(id: string): Promise<bloggersType | null> {
    return bloggersModel.findOne({ id: id }, { projection: { _id: 0 } });
  }

  async deleteBloggersById(id: string): Promise<boolean> {
    //const result = await bloggersModel.deleteOne({ id: id });
    const bloggersInstance = await bloggersModel.findOne({ id: id });
    if (!bloggersInstance) {
      return false;
    }
    await bloggersInstance.deleteOne();

    return true;
  }
  async createBloggers(bloggersnew: bloggersType): Promise<bloggersType> {
    const bloggersInstance = new bloggersModel();
    bloggersInstance.id = bloggersnew.id;
    bloggersInstance.name = bloggersnew.name;
    bloggersInstance.youtubeUrl = bloggersnew.youtubeUrl;

    await bloggersInstance.save();

    /*    const bloggersNew = await bloggersModel.insertMany({
      ...bloggersnew,
      _id: new ObjectId(),
    }); */

    return bloggersnew;
  }

  async updateBloggers(
    id: string,
    name: string,
    youtubeUrl: string
  ): Promise<boolean> {
    const bloggersInstance = await bloggersModel.findOne({ id: id });
    /*  const result = await bloggersModel.updateOne(
      { id: id },
      { $set: { name: name, youtubeUrl: youtubeUrl } }
    ); */
    if (!bloggersInstance) {
      return false;
    }
    bloggersInstance.name = name;
    bloggersInstance.youtubeUrl = youtubeUrl;
    await bloggersInstance.save();
    return true;
  }

  async getBloggersPost(
    bloggerId: string,
    pageSize: number,
    pageNumber: number
  ): Promise<postsReturn> {
    const postsBloggerId = await postsModel
      .find({ bloggerId: bloggerId })
      .lean();
    const totalCount = postsBloggerId.length;

    const items = await postsModel
      .find({ bloggerId: bloggerId }, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    console.log(items);
    return {
      totalCount: totalCount,
      items: items,
    };
  }

  async createBloggersPost(postnew: postsType): Promise<postsType> {
    await postsModel.insertMany({
      ...postnew,
      _id: new ObjectId(),
    });

    return postnew;
  }
}
container.bind(BloggersRepository).to(BloggersRepository);
