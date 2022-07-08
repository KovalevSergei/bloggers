import {
  bloggersCollection,
  commentsCollection,
  postsCollection,
  userscollection,
  ipCollection,
} from "./db";

export const testingRepository = {
  async deleteAll(): Promise<boolean> {
    await bloggersCollection.deleteMany({});
    await userscollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await ipCollection.deleteMany({});

    return true;
  },
};
