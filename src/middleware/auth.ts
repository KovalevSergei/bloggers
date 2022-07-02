import { Router, Request, Response, NextFunction } from "express";
import { UsersServis } from "../domain/Users-servis";
import { jwtService } from "../application/jwt-service";

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
  console.log(token);
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    req.user = await UsersServis.findUserById(userId);

    next();
  }
  res.send(401);
};
