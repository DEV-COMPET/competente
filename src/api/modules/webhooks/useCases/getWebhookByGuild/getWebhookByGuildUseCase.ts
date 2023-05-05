import { WebhookType } from "../../entities/webhooks.entities";
import { WebhookRepository as InterfaceWebhookRepository } from "../../repositories";
export interface InterfaceGetWebhookByGuildUseCase {
  execute: (guildId: string) => Promise<WebhookType>;
}
export class GetWebhookByGuildUseCase
  implements InterfaceGetWebhookByGuildUseCase
{
  constructor(private readonly repository: InterfaceWebhookRepository) {}
  async execute(guildId: string): Promise<WebhookType> {
    const webhooks = await this.repository.listByName("Autentique Webhook");
    const webhook = webhooks.find((webhook) => webhook.guildId === guildId);
    if (!webhook) {
      throw new Error(
        "Não existe nenhum webhook do autentique nesse servidor "
      );
    }
    return webhook;
  }
}
