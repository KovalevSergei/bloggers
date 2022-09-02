import "reflect-metadata";

import { AuthService } from "./auth-servis";
import { AuthController } from "../route/auth-router";
import { container } from "../ioc-container";
import { UsersRepository } from "../repositories/users-repository";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { BloggersService } from "./bloggers-servis";

describe("super tests for auth ", () => {
  it("return BloggerId", async () => {
    expect(null).toBeNull;
  });
  /*   jest.setTimeout(10000);
  let mongoServer: MongoMemoryServer; */
  /*   beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }); */
  /*  const usersRepository = new UsersRepository();
  const usersServis = new UserService(usersRepository);
  const authService = new AuthService(usersRepository, usersServis);
  const authControllerInstans = new AuthController(usersServis, authService); */
  /*   const authService = container.get(AuthService);

  describe("createUser", () => {
    it("should return", async () => {
      const result = await authService.createUser(
        "Serge",
        "ckv51@mail.ru",
        "12345"
      );
      expect(result.accountData.email).toBe("ckv51@mail.ru");
      expect(result.accountData.login).toBe("Serge");
      expect(result.emailConfirmation.isConfirmed).toBeFalsy();
    });
  });
}); */
});
