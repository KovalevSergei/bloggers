import { ObjectId } from "mongodb";
import { likePostsModel, postsModel } from "./db";
import { postsType, likePostWithId, likePosts } from "./types";
import { injectable } from "inversify";
import { container } from "../ioc-container";
interface postsreturn {
  items: postsType[];
  totalCount: number;
}
@injectable()
export class PostsRepository {
  async getPosts(pageNumber: number, pageSize: number): Promise<postsreturn> {
    const posts = await postsModel
      .find({}, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await postsModel.countDocuments();
    return {
      totalCount: totalCount,
      items: posts,
    };
  }

  async getpostsId(id: string): Promise<postsType | null> {
    return postsModel.findOne({ id: id }, { projection: { _id: 0 } });
  }

  async updatePostsId(
    id: string,
    title: string,
    shortDescription: string,
    content: string
  ): Promise<boolean | null> {
    const postsnew = await postsModel.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
        },
      }
    );
    return postsnew.modifiedCount === 1;
  }
  async createPosts(postsnew: postsType): Promise<postsType> {
    await postsModel.insertMany({ ...postsnew, _id: new ObjectId() });
    return postsnew;
  }

  async deletePosts(id: string): Promise<boolean> {
    const result = await postsModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }
  async findLikeStatus(
    postId: string,
    userId: string
  ): Promise<likePostWithId | null> {
    const result = await likePostsModel.findOne({
      postId: postId,
      userId: userId,
    });
    return result;
  }
  async createLikeStatus(likePostForm: likePosts): Promise<boolean> {
    const likeInstance = new likePostsModel();
    likeInstance.postsId = likePostForm.postsId;
    likeInstance.userId = likePostForm.userId;
    likeInstance.myStatus = likePostForm.myStatus;
    likeInstance.addedAt = likePostForm.addedAt;
    likeInstance.login = likePostForm.login;
    await likeInstance.save();
    return true;
  }
  async deleteLike(postId: string, userId: string): Promise<boolean> {
    const result = await likePostsModel.deleteOne({
      postId: postId,
      userId: userId,
    });
    return true;
  }
  async getLikeStatus(
    postId: string,
    userId: string
  ): Promise<{
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  }> {
    const result = { likesCount: 0, dislikesCount: 0, myStatus: "None" };
    const likesCount = await likePostsModel.countDocuments({
      postId: postId,
      myStatus: "Like",
    });
    result.likesCount = likesCount;
    const disLikes = await likePostsModel.countDocuments({
      postId: postId,
      myStatus: "Dislike",
    });
    result.dislikesCount = disLikes;
    const my = await likePostsModel.findOne({
      postId: postId,
      userId: userId,
    });
    console.log(my, "postStatus");
    if (my === null) {
      return result;
    } else {
      const a = my as likePostWithId;
      result.myStatus = a.myStatus;
    }

    return result;
  }
  async getNewestLikes(postId: string): Promise<likePostWithId[]> {
    const result = await likePostsModel
      .find({ postId: postId, myStatus: "Like" })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
    return result || [];
  }
  async getLikesBloggersPost(postsId: any): Promise<likePostWithId[]> {
    const result = await likePostsModel.find({
      myStatus: "Like",
      postId: { $in: postsId },
    });
    return result;
  }
  async getDislikeBloggersPost(postsId: any): Promise<likePostWithId[]> {
    const result = await likePostsModel.find({
      myStatus: "Dislike",
      postId: { $in: postsId },
    });
    return result;
  }
}

container.bind(PostsRepository).to(PostsRepository);
