import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "../domain/Users-servis";
import { jwtService } from "../application/jwt-service";
import { UsersRepository } from "../repositories/users-repository";

export const userIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    req.user = null;
    next();
    return;
  }
  const token = req.headers.authorization?.split(" ")[1];

  const userId = await jwtService.getUserIdByToken(token);

  if (userId) {
    const usersService = new UserService(new UsersRepository());
    req.user = await usersService.findUserById(userId);

    next();
    return;
  }
};
