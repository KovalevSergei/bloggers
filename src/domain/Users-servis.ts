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
import { v4 as uuidv4 } from "uuid";
import { compareAsc, format, add } from "date-fns";

export const UsersServis = {
  async createUser(
    login: string,
    email: string,
    password: string
  ): Promise<UsersDBType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newUser: UsersDBType = {
      id: Number(new Date()).toString(),
      accountData: {
        login: login,
        email: email,
        passwordHash,
        passwordSalt,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };

    const User = await UsersRepository.createUser(newUser);

    return User;
  },
  async checkCredentials(
    users: UsersDBTypeWithId,
    login: string,
    password: string
  ) {
    const user = await UsersRepository.FindUserLogin(login);
    if (!user) return false;
    const passwordHash = await this._generateHash(
      password,
      user.accountData.passwordSalt
    );
    if (user.accountData.passwordHash !== passwordHash) {
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
  async findUserById(id: string): Promise<UsersDBTypeWithId | null> {
    const result = await UsersRepository.findUserById(id);
    return result;
  },

  async getUserById(id: string): Promise<UsersDBType | null> {
    const result = await UsersRepository.getUserById(id);
    return result;
  },
};
