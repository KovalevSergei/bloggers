import { UsersDBType } from "../repositories/types";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { settings } from "../settings";

export const jwtService = {
  async createJWT(user: UsersDBType) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return result.userId;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
