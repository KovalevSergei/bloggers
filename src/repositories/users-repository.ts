import { ObjectId } from "mongodb";
import { userscollection } from "./db";
import { UsersDBType, UsersDBTypeReturn, UsersDBTypeWithId } from "./types";

interface usersReturn {
  items: UsersDBType[];
  totalCount: number;
}

export const UsersRepository = {
  async createUser(newUser: UsersDBType): Promise<UsersDBTypeReturn> {
    const createUser = await userscollection.insertOne({
      ...newUser,
      _id: new ObjectId(),
    });
    return {
      id: newUser.id,
      email: newUser.accountData.email,
      login: newUser.accountData.login,
    };
  },

  //filters: { page: number, size: number, name: string }
  async getUsers(PageSize: number, PageNumber: number): Promise<usersReturn> {
    const totalCount = await userscollection.countDocuments();
    const items = await userscollection
      .find({}, { projection: { _id: 0, passwordHash: 0, passwordSalt: 0 } })
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
    const usersFind = await userscollection.findOne({ login: login });
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
  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await userscollection.findOne({
      $or: [
        { "accountData.email": loginOrEmail },
        { "accountData.userName": loginOrEmail },
      ],
    });
    return user;
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
};
