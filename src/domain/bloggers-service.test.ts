import "reflect-metadata";

import { AuthService } from "./auth-servis";
import { AuthController } from "../route/auth-router";
import { container } from "../ioc-container";
import { UsersRepository } from "../repositories/users-repository";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { BloggersService } from "./bloggers-servis";
import { MongoTailableCursorError } from "mongodb";

describe("proverka bloggera", () => {
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

  const bloggersService = container.get(BloggersService);
  describe("createBlogger", () => {
    it("should return", async () => {
      const result = await bloggersService.createBloggers(
        "Serge",
        "https://api-swagger.it-incubator.ru/swagger/index.html?urls.primaryName=ht_01_bloggers%20API"
      );
      expect(result.name).toBe("Serge");
      expect(result.youtubeUrl).toBe(
        "https://api-swagger.it-incubator.ru/swagger/index.html?urls.primaryName=ht_01_bloggers%20API"
      );
    });
  });

  it("return", async () => {
    const result = await bloggersService.getBloggers(1, 1, "Serg");
    expect(result.items[0]?.name).toBe("Serge");
  });
  it("delete", async () => {
    const createBloggerDelet = await bloggersService.createBloggers(
      "Serge",
      "https://api-swagger.it-incubator.ru/swagger/index.html?urls.primaryName=ht_01_bloggers%20API"
    );
    const result = await bloggersService.deleteBloggersById(
      createBloggerDelet.id
    );
    expect(result).toBeTruthy;
  });
  it("return BloggerId", async () => {
    const createBloggerId = await bloggersService.createBloggers(
      "Pete",
      "https://api-swagger.it-incubator.ru/swagger/index.html?urls.primaryName=ht_01_bloggers%20API"
    );
    const result = await bloggersService.getBloggersById(createBloggerId.id);
    const result2 = await bloggersService.getBloggersById("3");
    expect(result?.name).toBe("Pete");
    expect(result2).toBeNull;
  });
  it("upDate Bloggers", async () => {
    const createBlogger = await bloggersService.createBloggers(
      "Peter",
      "https://api-swagger.it-incubator.ru/swagger/index.html?urls.primaryName=ht_01_bloggers%20API"
    );
    const result = await bloggersService.updateBloggers(
      createBlogger.id,
      "Vasy",
      "https://api-swagger.it"
    );
    expect(result).toBeTruthy;
  });
});
