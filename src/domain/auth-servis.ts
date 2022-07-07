import { UsersServis } from "./Users-servis";
import { v4 as uuidv4 } from "uuid";
import { compareAsc, format, add } from "date-fns";
import { UsersRepository } from "../repositories/users-repository";
import { Result } from "express-validator";
import bcrypt from "bcrypt";
import { emailAdapter } from "../adapters/email-adapter";
import { UsersDBType, UsersDBTypeReturn } from "../repositories/types";

export const authService = {
  async createUser(
    login: string,
    email: string,
    password: string
  ): Promise<UsersDBTypeReturn | boolean> {
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
    const createResult = UsersServis.createUser(login, email, password);
    await emailAdapter.sendEmail(email, "Return new service", "Avtorizacia");
    return createResult;
  },
  async confirmEmail(email: string): Promise<boolean> {
    let user = await UsersRepository.findByEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    await emailAdapter.sendEmail(email, "Return new service", "Avtorizacia");
    let result = await UsersRepository.updateConfirmation(user.id); //подтвердить пользователя с таким айди
    return result;
  },

  async confirmCode(code: string): Promise<boolean> {
    let user = await UsersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    await emailAdapter.sendEmail(
      user.accountData.email,
      "Return new service",
      "Avtorizacia"
    );
    let result = await UsersRepository.updateConfirmation(user.id); //подтвердить пользователя с таким айди
    return result;
  },
};