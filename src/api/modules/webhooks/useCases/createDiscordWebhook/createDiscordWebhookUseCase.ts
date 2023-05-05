import { WebhookType, Webhook } from "../../entities/webhooks.entities";
import { WebhookRepository as InterfaceWebhookRepository } from "../../repositories";
export interface InterfaceCreateDiscordWebhookUseCase {
  execute: (data: WebhookType) => Promise<WebhookType | undefined>;
}

export class CreateDiscordWebhookUseCase
  implements InterfaceCreateDiscordWebhookUseCase
{
  constructor(private readonly repository: InterfaceWebhookRepository) {}
  async execute(webhookData: WebhookType): Promise<WebhookType | undefined> {
    const existentWebhook = await this.repository.getById(webhookData.id);
    if (!existentWebhook) {
      const createdWebhook = new Webhook(webhookData);
      try {
        await this.repository.create(webhookData);
        return createdWebhook;
      } catch (error) {
        console.error(error);
        throw new Error(
          "Desculpe, não foi possível registrar o Webhook no momento, por favor, tente novamente mais tarde!"
        );
      }
    }
    throw new Error(
      "Este Webhook já se encontra cadastrado na nossa base de dados!"
    );
  }
}
