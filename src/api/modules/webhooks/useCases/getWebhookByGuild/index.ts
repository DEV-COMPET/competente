import { GetWebhookByGuildUseCase } from "./getWebhookByGuildUseCase";
import { GetWebhookByGuildController } from "./getWebhookByGuildController";
import { WebhookRepository } from "../../repositories/defaultMongoDBRepository/webhooksRepository";
export default (): GetWebhookByGuildController => {
  const repository = new WebhookRepository();
  const useCase = new GetWebhookByGuildUseCase(repository);
  return new GetWebhookByGuildController(useCase);
};
