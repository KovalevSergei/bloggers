import {
  bloggersModel,
  commentsModel,
  postsModel,
  usersModel,
  ipModel,
  likeCommentsModel,
  likePostsModel,
} from "./db";

export const testingRepository = {
  async deleteAll(): Promise<boolean> {
    await bloggersModel.deleteMany({});
    await usersModel.deleteMany({});
    await commentsModel.deleteMany({});
    await postsModel.deleteMany({});
    await ipModel.deleteMany({});
    await likeCommentsModel.deleteMany({});
    await likePostsModel.deleteMany({});
    return true;
  },
};
