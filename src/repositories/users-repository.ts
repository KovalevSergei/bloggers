import { ObjectId } from "mongodb";
import { refreshTokencollection, userscollection } from "./db";
import {
  UsersDBType,
  UsersDBTypeReturn,
  UsersDBTypeWithId,
  refreshToken,
} from "./types";

interface usersReturn {
  items: UsersDBType[];
  totalCount: number;
}

export const UsersRepository = {
  async createUser(newUser: UsersDBType): Promise<UsersDBType> {
    const createUser = await userscollection.insertOne({
      ...newUser,
      _id: new ObjectId(),
    });
    return newUser;
  },

  //filters: { page: number, size: number, name: string }
  async getUsers(PageSize: number, PageNumber: number): Promise<usersReturn> {
    const totalCount = await userscollection.countDocuments();
    const items = await userscollection
      .find({}, { projection: { _id: 0, emailConfirmation: 0 } })
      .skip((PageNumber - 1) * PageSize)
      .limit(PageSize)
      .toArray();
    return { totalCount: totalCount, items: items };
  },
  async deleteUsersId(id: string): Promise<boolean> {
    const result = await userscollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async userGetLogin(login: string): Promise<boolean> {
    const usersFind = await userscollection.find({ login: login }).toArray();
    console.log(usersFind);
    if (usersFind.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  async FindUserLogin(login: string): Promise<UsersDBTypeWithId | null> {
    const usersFind = await userscollection.findOne({
      "accountData.login": login,
    });
    return usersFind;
  },
  async findUserById(id: string): Promise<UsersDBTypeWithId | null> {
    const usersFind = await userscollection.findOne({ id: id });
    return usersFind;
  },
  async getUserById(id: string): Promise<UsersDBType | null> {
    const result = await userscollection.findOne(
      { id: id },
      { projection: { _id: 0 } }
    );
    return result;
  },
  async updateConfirmation(id: string) {
    const result = await userscollection.updateOne(
      { id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return result.modifiedCount === 1;
  },

  async findByConfirmationCode(code: string) {
    const user = await userscollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return user;
  },
  async findByEmail(email: string) {
    const user = await userscollection.findOne({
      "accountData.email": email,
    });
    return user;
  },
  async updateCode(id: string, code: string) {
    const result = await userscollection.updateOne(
      { id },
      { $set: { "emailConfirmation.confirmationCode": code } }
    );
    return result.modifiedCount === 1;
  },
  async refreshTokenSave(token: string) {
    const result = await refreshTokencollection.insertOne({
      token: `refreshToken=${token}`,
      _id: new ObjectId(),
    });
    return true;
  },
  async refreshTokenFind(token: string): Promise<refreshToken | null> {
    const result = await refreshTokencollection.findOne({ token: token });
    return result;
  },
  async refreshTokenKill(token: string): Promise<boolean> {
    const result = await refreshTokencollection.deleteOne({ token: token });
    return result.deletedCount === 1;
  },
};
