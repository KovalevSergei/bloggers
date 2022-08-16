import { Router, Request, Response } from "express";
export const usersRouter = Router();
import { body, validationResult } from "express-validator";
import { inputValidation } from "../middleware/validation";
import { basicAuth } from "../middleware/basicAuth";
import { id } from "date-fns/locale";
//import { userInstance } from "../compositions-root";
import { injectable } from "inversify";
import { container } from "../ioc-container";
import { UsersService } from "../domain/Users-servis";
import { constants } from "http2";
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
  constructor(protected usersService: UsersService) {}

  async createUser(req: Request, res: Response) {
    const login: string = req.body.login;
    const password: string = req.body.password;
    const email: string = req.body.email;
    const newUser = await this.usersService.createUser(login, email, password);

    const user = { id: newUser.id, login: newUser.accountData.login };
    res.status(201).send(user);
  }
  async getUsers(req: Request, res: Response) {
    const PageNumber: number = Number(req.query.PageNumber) || 1;
    const PageSize: number = Number(req.query.PageSize) || 10;
    const getUsers = await this.usersService.getUsers(PageNumber, PageSize);
    return res.send(getUsers);
  }
  async deleteUserId(req: Request, res: Response) {
    const id = req.params.id;
    const userDel = await this.usersService.deleteUserId(id);
    if (userDel) {
      res.sendStatus(204);
    } else {
      res.status(404).send("If specified user is not exists");
    }
  }
}

container.bind<UserController>(UserController).to(UserController);

const userInstance = container.resolve(UserController);
usersRouter.post(
  "/",
  basicAuth,
  loginValidation,
  passwordValidation,
  inputValidation,
  userInstance.createUser.bind(userInstance)
);

usersRouter.get("/", userInstance.getUsers.bind(userInstance));

usersRouter.delete(
  "/:id",
  basicAuth,
  userInstance.deleteUserId.bind(userInstance)
);
