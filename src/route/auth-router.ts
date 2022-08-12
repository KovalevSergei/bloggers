import { Router, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
//import { authService } from "../domain/auth-servis";
import { body, validationResult } from "express-validator";
import { Mistake429 } from "../middleware/Mistake429";

export const authRouter = Router({});
import rateLimit from "express-rate-limit";
import { inputValidation } from "../middleware/validation";
import { codeValidationConfirmed } from "../middleware/codeFind";
import { mailFind } from "../middleware/mailFind";
import { loginFind } from "../middleware/loginFind";
import { emailExist } from "../middleware/emailExist";
import { authMiddleware } from "../middleware/auth";
//import { authControllerInstans } from "../compositions-root";
import { AuthService } from "../domain/auth-servis";
//import { userscollection } from "../repositories/db";
import { injectable } from "inversify";
import { container } from "../ioc-container";
import { UsersService } from "../domain/Users-servis";
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
const emailValidation = body("email")
  .exists()
  .trim()
  .notEmpty()
  .isString()
  .isEmail();
const codeValidation = body("code").exists().trim().notEmpty().isString();

/* const limiter = rateLimit({
  windowMs: 10 * 1000, //  10sec
  max: 2, // Limit each IP to 5 requests per `window` (here, per 10 sec )
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429,
}); */
@injectable()
export class AuthController {
  constructor(
    protected usersServis: UsersService,
    protected authService: AuthService
  ) {}
  async loginPost(req: Request, res: Response) {
    const user = await this.usersServis.getUserByLogin(req.body.login);
    if (!user) return res.sendStatus(401);
    // req.ip or req.headers['x-forwarder-for'] or req.connection.remoteAddress

    const areCredentialsCorrect = await this.usersServis.checkCredentials(
      user,
      req.body.login,
      req.body.password
    );
    if (!areCredentialsCorrect) {
      res.sendStatus(401);
      return;
    }
    const token = await jwtService.createJWT(user);
    const refreshToken = await jwtService.createJWTrefresh(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });
    return res.status(200).send({ accessToken: token });
  }
  async createUser(req: Request, res: Response) {
    const user = await this.authService.createUser(
      req.body.login,
      req.body.email,
      req.body.password
    );

    res.sendStatus(204);
  }
  async registrationEmailResending(req: Request, res: Response) {
    const result = await this.authService.confirmEmail(req.body.email);
    if (result) {
      res.sendStatus(204);
    } else {
      res.status(400).send({
        errorsMessages: [
          {
            message: "string",
            field: "string",
          },
        ],
      });
    }
  }
  async confirmCode(req: Request, res: Response) {
    const result = await this.authService.confirmCode(req.body.code);
    res.sendStatus(204);
  }
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }
    const tokenExpire = await jwtService.getUserIdByToken(refreshToken);
    if (tokenExpire === null) {
      res.sendStatus(401);
      return;
    }
    const findToken = await this.authService.refreshTokenFind(refreshToken);

    if (findToken === false) {
      res.sendStatus(401);
      return;
    }
    await this.authService.refreshTokenKill(refreshToken);
    const userId = await jwtService.getUserIdByToken(refreshToken);
    const user = await this.usersServis.findUserById(userId);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    const token = await jwtService.createJWT(user);
    const RefreshToken = await jwtService.createJWTrefresh(user);

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });
    res.status(200).send({ accessToken: token });
  }
  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    const tokenExpire = await jwtService.getUserIdByToken(refreshToken);
    if (tokenExpire === null) {
      res.sendStatus(401);
      return;
    }
    const result = await this.authService.refreshTokenKill(refreshToken);
    if (result === true) {
      res.sendStatus(204);
      return;
    } else {
      res.sendStatus(401);
    }
  }
  async me(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.sendStatus(401);
    } else {
      const userId = await jwtService.getUserIdByToken(token);
      const user = await this.usersServis.findUserById(userId);

      const result = {
        email: user?.accountData.email,
        login: user?.accountData.login,
        userId: user?.id,
      };
      res.status(200).send(result);
    }
  }
}
container.bind(AuthController).to(AuthController);
let authControllerInstans = container.resolve(AuthController);
authRouter.post(
  "/login",
  Mistake429,
  loginValidation,
  passwordValidation,
  inputValidation,
  authControllerInstans.loginPost.bind(authControllerInstans)
);

authRouter.post(
  "/registration",
  Mistake429,
  loginValidation,
  emailValidation,
  passwordValidation,
  inputValidation,
  mailFind,
  loginFind,
  authControllerInstans.createUser.bind(authControllerInstans)
);

authRouter.post(
  "/registration-email-resending",
  Mistake429,
  emailValidation,
  emailExist,
  inputValidation,
  authControllerInstans.registrationEmailResending
),
  authRouter.post(
    "/registration-confirmation",
    Mistake429,
    codeValidationConfirmed,
    authControllerInstans.confirmCode.bind(authControllerInstans)
  );

authRouter.post(
  "/refresh-token",
  authControllerInstans.refreshToken.bind(authControllerInstans)
);

authRouter.post(
  "/logout",
  authControllerInstans.logout.bind(authControllerInstans)
);

authRouter.get(
  "/me",
  authMiddleware,
  authControllerInstans.me.bind(authControllerInstans)
);
