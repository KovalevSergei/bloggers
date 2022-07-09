import { Router, Request, Response, NextFunction } from "express";
import { UsersServis } from "../domain/Users-servis";
import { commentsCollection, ipCollection } from "../repositories/db";
import { ObjectId } from "mongodb";

export const Mistake429 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const point = req.method;
  const ip = req.ip;

  const newCRUD = {
    point: point,
    ip: ip,
    data: new Date(),
  };
  await ipCollection.insertOne({ ...newCRUD, _id: new ObjectId() });
  const fromData = new Date();
  fromData.setSeconds(fromData.getSeconds() - 10);
  const totalCount = await ipCollection.count({
    point: point,
    ip: ip,
    data: { $gt: fromData },
  });

  if (totalCount > 5) {
    res.sendStatus(429);
    return;
  } else {
    next();
  }
};
