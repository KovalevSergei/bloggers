import { Router, Request, Response } from "express";
import { UserService } from "../domain/Users-servis";
export const usersRouter = Router();
import { body, validationResult } from "express-validator";
import { inputValidation } from "../middleware/validation";
import basicAuth from "../middleware/basicAuth";
import { id } from "date-fns/locale";
//import { userInstance } from "../compositions-root";
import { injectable } from "inversify";
import { container } from "../ioc-container";
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
@injectable()
export class UserController {
  constructor(protected usersServis: UserService) {}

  async createUser(req: Request, res: Response) {
    const login: string = req.body.login;
    const password: string = req.body.password;
    const email: string = req.body.email;
    console.log(req.baseUrl);
    const newUser = await this.usersServis.createUser(login, email, password);

    const user = { id: newUser.id, login: newUser.accountData.login };
    res.status(201).send(user);
  }
  async getUsers(req: Request, res: Response) {
    const PageNumber: number = Number(req.query.PageNumber) || 1;
    const PageSize: number = Number(req.query.PageSize) || 10;
    const getUsers = await this.usersServis.getUsers(PageNumber, PageSize);
    return res.send(getUsers);
  }
  async deleteUserId(req: Request, res: Response) {
    const id = req.params.id;
    const userDel = await this.usersServis.deleteUserId(id);
    if (userDel) {
      res.sendStatus(204);
    } else {
      res.status(404).send("If specified user is not exists");
    }
  }
}

container.bind(UserController).to(UserController);

let userInstance = container.resolve(UserController);
usersRouter.post(
  "/",
  basicAuth,
  loginValidation,
  passwordValidation,
  inputValidation,
  userInstance.createUser
);

usersRouter.get("/", userInstance.getUsers);

usersRouter.delete("/:id", basicAuth, userInstance.deleteUserId);
