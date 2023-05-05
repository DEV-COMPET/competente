import { Request, Response } from "express";
import { WebhookType } from "../../entities/webhooks.entities";
import { InterfaceCreateDiscordWebhookUseCase } from "./createDiscordWebhookUseCase";
export class CreateDiscordWebhookController {
  constructor(private readonly useCase: InterfaceCreateDiscordWebhookUseCase) {}
  async handler(request: Request, response: Response) {
    const webhookData: WebhookType = request.body;
    try {
      await this.useCase.execute(webhookData);
      return response.status(201).json({ message: "Webhook registered" });
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}
