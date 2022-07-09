import { Router, Request, Response } from "express";
import { UsersServis } from "../domain/Users-servis";
import { jwtService } from "../application/jwt-service";
import { authService } from "../domain/auth-servis";
import { body, validationResult } from "express-validator";
import { Mistake429 } from "../middleware/Mistake429";

export const authRouter = Router({});
import rateLimit from "express-rate-limit";
import { inputValidation } from "../middleware/validation";
import { codeFind } from "../middleware/codeFind";

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

authRouter.post("/login", Mistake429, async (req: Request, res: Response) => {
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
  Mistake429,
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

    res.sendStatus(204);
  }
);

authRouter.post(
  "/registration-email-resending",
  Mistake429,
  emailValidation,
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
    codeFind,
    async (req: Request, res: Response) => {
      const result = await authService.confirmCode(req.body.code);
      res.sendStatus(204);
    }
  );
