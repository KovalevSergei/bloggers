import { Router, Request, Response } from "express";
import { UsersServis } from "../domain/Users-servis";
export const usersRouter = Router();
import { body, validationResult } from "express-validator";
import { inputValidation } from "../middleware/validation";
import basicAuth from "../middleware/basicAuth";

const loginValidation = body("login")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 3, max: 10 });
const passwordValidation = body("password")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 6, max: 30 });

usersRouter.post(
  "/",
  basicAuth,
  loginValidation,
  passwordValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const login: string = req.body.login;
    const password: string = req.body.password;

    const newUser = await UsersServis.createUser(login, password);
    if (newUser) {
      res.status(201).send(newUser);
    } else {
      res.status(400).json({
        errorsMessages: { message: "login is use", field: "give new login" },
      });
    }
  }
);

usersRouter.get("/", async (req: Request, res: Response) => {
  console.log("users");

  const PageNumber: number = Number(req.query.PageNumber) || 1;
  const PageSize: number = Number(req.query.PageSize) || 10;
  const getUsers = await UsersServis.getUsers(PageNumber, PageSize);
  return res.send(getUsers);
});

usersRouter.delete("/:id", basicAuth, async (req: Request, res: Response) => {
  const userDel = await UsersServis.deleteUserId(req.params.id);
  if (userDel) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});
