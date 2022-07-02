import { ObjectId } from "mongodb";
import {
  bloggersCollection,
  postsCollection,
  userscollection,
} from "../repositories/db";
import {
  UsersDBType,
  usersGetDBType,
  UsersDBTypeReturn,
  UsersDBTypeWithId,
} from "../repositories/types";
import bcrypt from "bcrypt";
import { UsersRepository } from "../repositories/users-repository";

export const UsersServis = {
  async createUser(
    login: string,
    password: string
  ): Promise<UsersDBTypeReturn | boolean> {
    const loginFind = await UsersRepository.userGetLogin(login);
    if (loginFind === true) {
      return false;
    } else {
      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(password, passwordSalt);

      const newUser: UsersDBType = {
        id: Number(new Date()).toString(),
        login: login,
        passwordHash,
        passwordSalt,
      };
      return UsersRepository.createUser(newUser);
    }
  },
  async checkCredentials(
    users: UsersDBTypeWithId,
    login: string,
    password: string
  ) {
    const user = await UsersRepository.FindUserLogin(login);
    if (!user) return false;
    const passwordHash = await this._generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return false;
    }
    return user;
  },
  async getUserByLogin(login: string) {
    return UsersRepository.FindUserLogin(login);
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
  async getUsers(
    PageNumber: number,
    PageSize: number
  ): Promise<usersGetDBType> {
    const { items, totalCount } = await UsersRepository.getUsers(
      PageSize,
      PageNumber
    );

    //const userDtos = items.map(i => ({...i, id: i.id.toString()}))

    let pagesCount = Number(Math.ceil(totalCount / PageSize));
    const result: usersGetDBType = {
      pagesCount: pagesCount,
      page: PageNumber,
      pageSize: PageSize,
      totalCount: totalCount,
      items,
    };
    return result;
  },
  async deleteUserId(id: string): Promise<boolean> {
    return UsersRepository.deleteUsersId(id);
  },
  async findUserById(id: ObjectId): Promise<UsersDBTypeWithId | null> {
    const result = await UsersRepository.findUserById(id);
    return result;
  },

  async getUserById(id: string): Promise<UsersDBType | null> {
    const result = await UsersRepository.getUserById(id);
    return result;
  },
};
