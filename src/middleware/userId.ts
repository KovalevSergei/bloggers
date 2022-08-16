import { Router, Request, Response, NextFunction } from "express";
import { jwtService } from "../application/jwt-service";
import { UsersService } from "../domain/Users-servis";
import { UsersRepository } from "../repositories/users-repository";

export const userIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    /*  console.log("1");
    req.user = {
      id: "1",
      accountData: {
        login: "s",
        email: "s",
        passwordHash: "s",
        passwordSalt: "string",
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: "string",
        expirationDate: new Date(),
        isConfirmed: false,
      },
    }; */

    req.user = null;

    next();
    return;
  }
  const token = req.headers.authorization?.split(" ")[1];
  const a = token;
  const userId = await jwtService.getUserIdByToken(a);

  if (userId) {
    const usersService = new UsersService(new UsersRepository());
    req.user = await usersService.findUserById(userId);
    next();
    return;
  }
  next();
  return;
};
