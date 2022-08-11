import { Router, Request, Response } from "express";
import { injectable } from "inversify";
import { EmailAdapter } from "../adapters/email-adapter";
import { container } from "../ioc-container";

export const emailRouter = Router({});
@injectable()
export class EmailController {
  constructor(protected emailAdapter: EmailAdapter) {}
  async postMessage(req: Request, res: Response) {
    await this.emailAdapter.sendEmail(
      req.body.email,
      req.body.subject,
      req.body.message
    );
  }
}
container.bind<EmailController>(EmailController).to(EmailController);
const emailControllerInstans = container.resolve(EmailController);

emailRouter.post(
  "/send",
  emailControllerInstans.postMessage.bind(emailControllerInstans)
);
