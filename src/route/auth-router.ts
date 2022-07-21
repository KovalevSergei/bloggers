import { Router, Request, Response } from "express";
import { UsersServis } from "../domain/Users-servis";
import { jwtService } from "../application/jwt-service";
import { authService } from "../domain/auth-servis";
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

authRouter.post(
  "/login",
  Mistake429,
  loginValidation,
  passwordValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const user = await UsersServis.getUserByLogin(req.body.login);
    if (!user) return res.sendStatus(401);
    // req.ip or req.headers['x-forwarder-for'] or req.connection.remoteAddress

    const areCredentialsCorrect = await UsersServis.checkCredentials(
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

    res.cookie(refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send({ accessToken: token });
  }
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
  async (req: Request, res: Response) => {
    const user = await authService.createUser(
      req.body.login,
      req.body.email,
      req.body.password
    );

    res.sendStatus(204);
  }
);

authRouter.post(
  "/registration-email-resending",
  Mistake429,
  emailValidation,
  emailExist,
  inputValidation,
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.email);
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
),
  authRouter.post(
    "/registration-confirmation",
    Mistake429,
    codeValidationConfirmed,
    async (req: Request, res: Response) => {
      const result = await authService.confirmCode(req.body.code);
      res.sendStatus(204);
    }
  );

authRouter.post("/refresh-token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.jwt;
  const findToken = await authService.refreshTokenFind(refreshToken);
  refreshToken.split(" ");
  if (findToken === false) {
    res.sendStatus(401);
  } else {
    const token = await jwtService.createJWT(refreshToken[1]);
    const RefreshToken = await jwtService.createJWTrefresh(refreshToken[1]);

    res.cookie("jwt", RefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
    });
    res.status(200).send({ accessToken: token });
  }
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.jwt;
  const result = await authService.refreshTokenKill(refreshToken);
  if (result === true) {
    res.sendStatus(201);
  } else {
    res.sendStatus(401);
  }
});

authRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
  } else {
    const userId = await jwtService.getUserIdByToken(token);
    const user = await UsersServis.findUserById(userId);

    const result = {
      email: user?.accountData.email,
      login: user?.accountData.login,
      userId: user?.id,
    };
    res.status(200).send(result);
  }
});
