import "reflect-metadata";

import { AuthService } from "./auth-servis";
import { AuthController } from "../route/auth-router";
import { container } from "../ioc-container";
import { UsersRepository } from "../repositories/users-repository";
import { UsersService } from "./Users-servis";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { BloggersService } from "./bloggers-servis";
import { MongoTailableCursorError } from "mongodb";
import { PostsService } from "./posts-servis";
import { postsType } from "../repositories/types";

describe("post", () => {
  jest.setTimeout(10000);
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const postsService = container.get(PostsService);
  const bloggersService = container.get(BloggersService);
  describe("createPost", () => {
    it("should return", async () => {
      const blogger = await bloggersService.createBloggers("Serge", "sfsffs");
      const result = await postsService.createPosts(
        "frog",
        "sfsffs",
        "horror",
        blogger.id
      );
      if (result) {
        let bloggers = result as postsType;
        expect(bloggers.bloggerId).toBe(blogger.id);
      }
    });
    it("getPost", async () => {
      const post = await postsService.getPosts(1, 1);
      expect(post.items[0].bloggerName).toBe("Serge");
    });

    it("getIdPost", async () => {
      const blogger = await bloggersService.createBloggers("Rehat", "sfsffs");
      const result = await postsService.createPosts(
        "frog",
        "sfsffs",
        "horror",
        blogger.id
      );
      if (result) {
        const bloggers2 = result as postsType;
        const proverka = await postsService.getpostsId(bloggers2.id);
        if (proverka) {
          const proverka2 = proverka as postsType;
          expect(proverka2.id).toBe(bloggers2.id);
        }
      }
    });
    it("deletePost", async () => {
      const blogger = await bloggersService.createBloggers("Rehat", "sfsffs");
      const result = await postsService.createPosts(
        "frog",
        "sfsffs",
        "horror",
        blogger.id
      );
      if (result) {
        const bloggers2 = result as postsType;

        const result2 = await postsService.updatePostsId(
          bloggers2.id,
          "title",
          "shortDes",
          "content",
          bloggers2.bloggerId
        );

        expect(result2).toBeTruthy;
      }
    });
  });
});
