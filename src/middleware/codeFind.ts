import { Router, Request, Response, NextFunction } from "express";
import { userscollection } from "../repositories/db";

export const codeFind = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.body.code;

  const codeRetrun = await userscollection.findOne({
    "emailConfirmation.confirmationCode": code,
  });
  if (!codeRetrun) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "string",
          field: "string",
        },
      ],
    });
    return;
  } else {
    next();
  }
};
