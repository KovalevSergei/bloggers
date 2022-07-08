import { Router, Request, Response } from "express";
import { testingService } from "../domain/testing-servis";
export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await testingService.deleteCollection();
  res.sendStatus(204);
});
