import { UsersService } from "./Users-servis";
import { v4 as uuidv4 } from "uuid";
import { compareAsc, format, add } from "date-fns";
import { UsersRepository } from "../repositories/users-repository";
import { Result } from "express-validator";
import bcrypt from "bcrypt";
import { EmailAdapter } from "../adapters/email-adapter";
import {
  UsersDBType,
  UsersDBTypeReturn,
  refreshToken,
} from "../repositories/types";
import { jwtService } from "../application/jwt-service";
import { container } from "../ioc-container";
import { injectable } from "inversify";

@injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersService: UsersService,
    protected emailAdapter: EmailAdapter
  ) {}
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
    const createResult = await this.usersService.createUser(
      login,
      email,
      password
    );
    if (createResult) {
      this.emailAdapter.sendEmail(
        email,
        "Registration",
        createResult.emailConfirmation.confirmationCode
      );
    }
    return createResult;
  }
  async confirmEmail(email: string): Promise<boolean> {
    let user = await this.usersRepository.findByEmail(email);

    if (!user) return false;
    const id = user.id;
    const code = uuidv4();
    await this.usersRepository.updateCode(id, code);
    this.emailAdapter.sendEmail(email, "email", code);

    return true;
  }

  async confirmCode(code: string): Promise<boolean> {
    let user = await this.usersRepository.findByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;

    let result = await this.usersRepository.updateConfirmation(user.id); //подтвердить пользователя с таким айди

    return result;
  }
  async refreshTokenSave(token: string): Promise<boolean | string> {
    let refreshToken = await UsersRepository.refreshTokenSave(token);
    return refreshToken;
  }
  async refreshTokenFind(token: string): Promise<boolean> {
    let refreshTokenFind = await this.usersRepository.refreshTokenFind(token);
    if (refreshTokenFind === null) {
      return false;
    }
    let refreshTokenTimeOut = await jwtService.getUserIdByToken(token);

    if (refreshTokenTimeOut === null) {
      return false;
    } else {
      return true;
    }
  }
  async refreshTokenKill(token: string): Promise<boolean> {
    //let result = await jwtService.getUserIdByToken(token);
    let result = await this.usersRepository.refreshTokenKill(token);
    if (result === false) {
      return false;
    } else {
      return true;
    }
  }
}
container.bind(AuthService).to(AuthService);
