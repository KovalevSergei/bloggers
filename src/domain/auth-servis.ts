import { UsersServis } from "./Users-servis";
import { v4 as uuidv4 } from "uuid";
import { compareAsc, format, add } from "date-fns";
import { UsersRepository } from "../repositories/users-repository";
import { Result } from "express-validator";
import bcrypt from "bcrypt";
import { emailAdapter } from "../adapters/email-adapter";
import {
  UsersDBType,
  UsersDBTypeReturn,
  refreshToken,
} from "../repositories/types";
import { jwtService } from "../application/jwt-service";

export const authService = {
  async createUser(
    login: string,
    email: string,
    password: string
  ): Promise<UsersDBType> {
    /*    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await UsersServis._generateHash(password, passwordSalt);
    const user: UsersDBType = {
      id: new Date().toString(),
      accountData: {
        login: login,
        email,
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
    }; */
    const createResult = await UsersServis.createUser(login, email, password);
    if (createResult) {
      await emailAdapter.sendEmail(
        email,
        "Registration",
        createResult.emailConfirmation.confirmationCode
      );
    }
    return createResult;
  },
  async confirmEmail(email: string): Promise<boolean> {
    let user = await UsersRepository.findByEmail(email);

    if (!user) return false;
    const id = user.id;
    const code = uuidv4();
    await UsersRepository.updateCode(id, code);
    await emailAdapter.sendEmail(email, "email", code);

    return true;
  },

  async confirmCode(code: string): Promise<boolean> {
    let user = await UsersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;

    let result = await UsersRepository.updateConfirmation(user.id); //подтвердить пользователя с таким айди

    return result;
  },
  async refreshTokenSave(token: string): Promise<boolean | string> {
    let refreshToken = await UsersRepository.refreshTokenSave(token);
    return refreshToken;
  },
  async refreshTokenFind(token: string): Promise<boolean> {
    let refreshTokenFind = await UsersRepository.refreshTokenFind(token);
    if (refreshTokenFind === null) {
      return false;
    }
    let refreshTokenTimeOut = await jwtService.getUserIdByToken(token);

    if (refreshTokenTimeOut === null) {
      return false;
    } else {
      return true;
    }
  },
};
