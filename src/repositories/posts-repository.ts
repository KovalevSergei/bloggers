import { ObjectId } from "mongodb";
import { postsCollection } from "./db";
import { postsType } from "./types";

interface postsreturn {
  items: postsType[];
  totalCount: number;
}

export const postsRepository = {
  async getPosts(pageNumber: number, pageSize: number): Promise<postsreturn> {
    const posts = await postsCollection
      .find({},{ projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments();
    return {
      totalCount: totalCount,
      items: posts,
    };
  },

  async getpostsId(id: number): Promise<postsType | null> {
    return postsCollection.findOne({ id: id });
  },

  async updatePostsId(
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number
  ): Promise<boolean | null> {
    const postsnew = await postsCollection.updateOne(
      { bloggerId: bloggerId },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
        },
      }
    );
    return postsnew.matchedCount === 1;
  },
  async createPosts(postsnew: postsType): Promise<postsType> {
    await postsCollection.insertOne({ ...postsnew, _id: new ObjectId() });
    return postsnew;
  },

  async deletePosts(id: number): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
};
