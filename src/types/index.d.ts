import { UsersDBType } from "../repositories/types";
import { Request } from "express";

declare global {
  declare namespace Express {
    export interface Request {
      user: UsersDBType | null;
    }
  }
}
