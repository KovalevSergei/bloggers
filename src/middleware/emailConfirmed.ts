import { Router, Request, Response, NextFunction } from "express";
import { usersModel } from "../repositories/db";

export const emailExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const mailReturn = await usersModel.findOne({
    "accountData.email": email,
  });
  if (mailReturn?.emailConfirmation.isConfirmed) {
    res.status(400).send({
      errorsMessages: [{ message: "mail not exist", field: "email" }],
    });
    return;
  }
  next();
};
