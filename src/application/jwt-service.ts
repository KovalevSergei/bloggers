import { UsersDBType } from "../repositories/types";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { settings } from "../application/settings";

export const jwtService = {
  async createJWT(user: UsersDBType) {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
      expiresIn: "1h",
    });
    return {
      resultCode: 0,
      data: {
        token: token,
      },
    };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },
};