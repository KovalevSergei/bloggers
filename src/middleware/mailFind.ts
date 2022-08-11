import { Router, Request, Response, NextFunction } from "express";
import { usersModel } from "../repositories/db";

export const mailFind = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const mailReturn = await usersModel.findOne({
    "accountData.email": email,
  });
  if (mailReturn) {
    res
      .status(400)
      .send({ errorsMessages: [{ message: "mail is used", field: "email" }] });
    return;
  } else {
    next();
  }
};
