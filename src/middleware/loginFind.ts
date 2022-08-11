import { Router, Request, Response, NextFunction } from "express";
import { usersModel } from "../repositories/db";

export const loginFind = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const login = req.body.login;
  const mailReturn = await usersModel.findOne({
    "accountData.login": login,
  });
  if (mailReturn) {
    res
      .status(400)
      .send({ errorsMessages: [{ message: "login is used", field: "login" }] });
    return;
  } else {
    next();
  }
};
