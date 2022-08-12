import { UsersDBType } from "../repositories/types";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { UsersRepository } from "../repositories/users-repository";

export const jwtService = {
  async createJWT(user: UsersDBType) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "600s",
    });
    return token;
  },

  async createJWTrefresh(user: UsersDBType) {
    const tokenRefresh = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "700s",
    });
    await UsersRepository.refreshTokenSave(tokenRefresh);

    return tokenRefresh;
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
