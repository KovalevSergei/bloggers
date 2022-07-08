import { Router, Request, Response } from "express";
import { UsersServis } from "../domain/Users-servis";
import { jwtService } from "../application/jwt-service";
import { authService } from "../domain/auth-servis";
import { body, validationResult } from "express-validator";

export const authRouter = Router({});
import rateLimit from "express-rate-limit";
import { inputValidation } from "../middleware/validation";

const emailSee = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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
  .matches(emailSee);
const codeValidation = body("code").exists().trim().notEmpty().isString();

const limiter = rateLimit({
  windowMs: 10 * 1000, //  10sec
  max: 5, // Limit each IP to 5 requests per `window` (here, per 10 sec )
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429,
});

authRouter.post("/login", limiter, async (req: Request, res: Response) => {
  const user = await UsersServis.getUserByLogin(req.body.login);
  if (!user) return res.sendStatus(401);
  // req.ip or req.headers['x-forwarder-for'] or req.connection.remoteAddress

  const areCredentialsCorrect = await UsersServis.checkCredentials(
    user,
    req.body.login,
    req.body.password
  );
  if (areCredentialsCorrect) {
    const token = await jwtService.createJWT(user);
    res.status(200).send({ token });
  } else {
    res.sendStatus(401);
  }
});

authRouter.post(
  "/registration",
  limiter,
  loginValidation,
  emailValidation,
  passwordValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const user = await authService.createUser(
      req.body.login,
      req.body.email,
      req.body.password
    );
    if (user) {
      res.status(204).send("code in the you email");
    } else {
      res.status(400).send();
    }
  }
);

authRouter.post(
  "/registration-email-resending",
  limiter,
  emailValidation,
  inputValidation,
  async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.email);
    if (result) {
      res.status(204).send("code in the you email");
    } else {
      res.sendStatus(400);
    }
  }
),
  authRouter.post(
    "/registration-confirmation",
    limiter,
    codeValidation,
    inputValidation,
    async (req: Request, res: Response) => {
      const result = await authService.confirmCode(req.body.code);
      if (result) {
        res.status(204).send("code in the you email");
      } else {
        res.sendStatus(400);
      }
    }
  );
