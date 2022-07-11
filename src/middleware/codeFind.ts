import { Router, Request, Response, NextFunction } from "express";
import { userscollection } from "../repositories/db";

export const codeValidationConfirmed = async (
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
          field: "code",
        },
      ],
    });

    return;
  }
  if (codeRetrun.emailConfirmation.isConfirmed) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "user is confirmed",
          field: "code",
        },
      ],
    });
    return;
  }
  next();
};
