import { ObjectId } from "mongodb";
import { tokenModel, usersModel } from "./db";
import {
  UsersDBType,
  UsersDBTypeReturn,
  UsersDBTypeWithId,
  refreshToken,
} from "./types";
import { injectable } from "inversify";
import { container } from "../ioc-container";

interface usersReturn {
  items: UsersDBType[];
  totalCount: number;
}
@injectable()
export class UsersRepository {
  async createUser(newUser: UsersDBType): Promise<UsersDBType> {
    const createUser = await usersModel.insertMany({
      ...newUser,
      _id: new ObjectId(),
    });
    return newUser;
  }

  //filters: { page: number, size: number, name: string }
  async getUsers(PageSize: number, PageNumber: number): Promise<usersReturn> {
    const totalCount = await usersModel.countDocuments();
    const items = await usersModel
      .find({}, { projection: { _id: 0, emailConfirmation: 0 } })
      .skip((PageNumber - 1) * PageSize)
      .limit(PageSize)
      .lean();
    return { totalCount: totalCount, items: items };
  }
  async deleteUsersId(id: string): Promise<boolean> {
    const result = await usersModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }

  async userGetLogin(login: string): Promise<boolean> {
    const usersFind = await usersModel.find({ login: login }).lean();
    console.log(usersFind);
    if (usersFind.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async FindUserLogin(login: string): Promise<UsersDBTypeWithId | null> {
    const usersFind = await usersModel.findOne({
      "accountData.login": login,
    });
    return usersFind;
  }
  async findUserById(id: string): Promise<UsersDBTypeWithId | null> {
    const usersFind = await usersModel.findOne({ id: id });
    return usersFind;
  }
  async getUserById(id: string): Promise<UsersDBType | null> {
    const result = await usersModel.findOne(
      { id: id },
      { projection: { _id: 0 } }
    );
    return result;
  }
  async updateConfirmation(id: string) {
    const result = await usersModel.updateOne(
      { id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return result.modifiedCount === 1;
  }
  async findByConfirmationCode(code: string) {
    const user = await usersModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return user;
  }
  async findByEmail(email: string) {
    const user = await usersModel.findOne({
      "accountData.email": email,
    });
    return user;
  }
  async updateCode(id: string, code: string) {
    const result = await usersModel.updateOne(
      { id },
      { $set: { "emailConfirmation.confirmationCode": code } }
    );
    return result.modifiedCount === 1;
  }
  static async refreshTokenSave(token: string) {
    const result = await tokenModel.insertMany({
      token: token,
      _id: new ObjectId(),
    });
    return true;
  }
  async refreshTokenFind(token: string): Promise<string | null> {
    const result = await tokenModel.findOne({ token: token });

    if (!result || !result.token) {
      return null;
    }

    return result.token;
  }
  async refreshTokenKill(token: string): Promise<boolean> {
    const result = await tokenModel.deleteOne({ token: token });
    return result.deletedCount === 1;
  }
}

container.bind(UsersRepository).to(UsersRepository);
