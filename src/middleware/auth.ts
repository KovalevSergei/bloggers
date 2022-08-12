import { Router, Request, Response, NextFunction } from "express";
import { jwtService } from "../application/jwt-service";
import { UsersService } from "../domain/Users-servis";
import { UsersRepository } from "../repositories/users-repository";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  const token = req.headers.authorization?.split(" ")[1];

  const userId = await jwtService.getUserIdByToken(token);

  if (userId) {
    const usersService = new UsersService(new UsersRepository());
    req.user = await usersService.findUserById(userId);

    next();

    return;
  }
  res.send(401);
};
