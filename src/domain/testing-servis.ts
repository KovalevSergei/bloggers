import { testingRepository } from "../repositories/testing-repository";

export const testingService = {
  async deleteCollection(): Promise<boolean> {
    return testingRepository.deleteAll();
  },
};
