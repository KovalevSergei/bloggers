import { Router, Request, Response, NextFunction } from "express";
import { userscollection } from "../repositories/db";

export const emailExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const mailReturn = await userscollection.findOne({
    "accountData.email": email,
  });
  if (!mailReturn) {
    res.status(400).send({
      errorsMessages: [{ message: "mail not exist", field: "email" }],
    });
    return;
  } else {
    next();
  }
};
