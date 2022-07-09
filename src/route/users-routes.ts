import { Router, Request, Response } from "express";
import { UsersServis } from "../domain/Users-servis";
export const usersRouter = Router();
import { body, validationResult } from "express-validator";
import { inputValidation } from "../middleware/validation";
import basicAuth from "../middleware/basicAuth";
import { id } from "date-fns/locale";

const loginValidation = body("login")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 3, max: 10 });
const passwordValidation = body("password")
  .exists()
  .trim()
  .notEmpty()
  .isLength({ min: 6, max: 20 });

usersRouter.post(
  "/",
  basicAuth,
  loginValidation,
  passwordValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const login: string = req.body.login;
    const password: string = req.body.password;
    const email: string = req.body.email;

    const newUser = await UsersServis.createUser(login, email, password);

    const user = { id: newUser.id, login: newUser.accountData.login };
    res.status(201).send(user);
  }
);

usersRouter.get("/", async (req: Request, res: Response) => {
  const PageNumber: number = Number(req.query.PageNumber) || 1;
  const PageSize: number = Number(req.query.PageSize) || 10;
  const getUsers = await UsersServis.getUsers(PageNumber, PageSize);
  return res.send(getUsers);
});

usersRouter.delete("/:id", basicAuth, async (req: Request, res: Response) => {
  const id = req.params.id;
  const userDel = await UsersServis.deleteUserId(id);
  if (userDel) {
    res.sendStatus(204);
  } else {
    res.status(404).send("If specified user is not exists");
  }
});
