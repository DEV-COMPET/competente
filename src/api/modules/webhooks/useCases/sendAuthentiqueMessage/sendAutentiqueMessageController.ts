import { Request, Response } from "express";
import { AutentiqueApiResponse } from "../../../../@types/autentique";
import { InterfaceSendAutentiqueMessageUseCase } from "./sendAutentiqueMessageUseCase";
export class SendAutentiqueMessageController {
  constructor(
    private readonly useCase: InterfaceSendAutentiqueMessageUseCase
  ) {}
  async handler(request: Request, response: Response): Promise<Response> {
    const apiResponse: AutentiqueApiResponse = request.body;
    if (
      !apiResponse ||
      !apiResponse.partes ||
      !apiResponse.arquivo ||
      !apiResponse.documento ||
      !apiResponse.remetente
    ) {
      return response.status(400).json({
        message: "No data provided",
      });
    }
    try {
      const { payload, webhook } = await this.useCase.execute(apiResponse);
      await webhook.send(payload);
      return response.status(200).send();
    } catch (error) {
      console.error(error);
      return response.status(400).send();
    }
  }
}
