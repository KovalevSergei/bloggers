import { ObjectId } from "mongodb";
import { bloggersCollection, postsCollection } from "./db";
import { bloggersType, postsDBType, postsType } from "./types";

interface bloggersReturn {
  items: bloggersType[];
  totalCount: number;
}
interface postsReturn {
  items: postsType[];
  totalCount: number;
}

export const bloggersRepository = {
  async getBloggers(
    pageSize: number,
    pageNumber: number,
    SearhName: string
  ): Promise<bloggersReturn> {
    const totalCount = await bloggersCollection.countDocuments({
      name: { $regex: SearhName },
    });

    const items = await bloggersCollection
      .find({ name: { $regex: SearhName } }, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();

    return {
      totalCount: totalCount,
      items: items,
    };
  },

  async getBloggersById(id: string): Promise<bloggersType | null> {
    return bloggersCollection.findOne({ id: id }, { projection: { _id: 0 } });
  },

  async deleteBloggersById(id: string): Promise<boolean> {
    const result = await bloggersCollection.deleteOne({ id: id });

    return result.deletedCount === 1;
  },
  async createBloggers(bloggersnew: bloggersType): Promise<bloggersType> {
    const bloggersNew = await bloggersCollection.insertOne({
      ...bloggersnew,
      _id: new ObjectId(),
    });

    return bloggersnew;
  },

  async updateBloggers(
    id: string,
    name: string,
    youtubeUrl: string
  ): Promise<boolean> {
    const result = await bloggersCollection.updateOne(
      { id: id },
      { $set: { name: name, youtubeUrl: youtubeUrl } }
    );

    return result.matchedCount === 1;
  },

  async getBloggersPost(
    bloggerId: string,
    pageSize: number,
    pageNumber: number
  ): Promise<postsReturn> {
    const postsBloggerId = await postsCollection
      .find({ bloggerId: bloggerId })
      .toArray();
    const totalCount = postsBloggerId.length;

    const items = await postsCollection
      .find({ bloggerId: bloggerId }, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    console.log(items);
    return {
      totalCount: totalCount,
      items: items,
    };
  },

  async createBloggersPost(postnew: postsType): Promise<postsType> {
    await postsCollection.insertOne({
      ...postnew,
      _id: new ObjectId(),
    });

    return postnew;
  },
};
