import { CreateDiscordWebhookUseCase } from "./createDiscordWebhookUseCase";
import { CreateDiscordWebhookController } from "./createDiscordWebhookController";
import { WebhookRepository } from "../../repositories/defaultMongoDBRepository/webhooksRepository";
export default (): CreateDiscordWebhookController => {
  const repository = new WebhookRepository();
  const useCase = new CreateDiscordWebhookUseCase(repository);
  return new CreateDiscordWebhookController(useCase);
};
