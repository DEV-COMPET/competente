import { Request, Response } from "express";
import { InterfaceGetWebhookByGuildUseCase } from "./getWebhookByGuildUseCase";
export class GetWebhookByGuildController {
  constructor(private readonly useCase: InterfaceGetWebhookByGuildUseCase) {}
  async handle(request: Request, response: Response): Promise<Response> {
    const guildId = request.params.guildId;
    try {
      const webhook = await this.useCase.execute(guildId);
      return response.status(200).json(webhook);
    } catch (error: any) {
      return response.status(404).json({ error: error.message });
    }
  }
}
