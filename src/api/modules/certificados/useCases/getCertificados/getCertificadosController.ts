import { Request, Response } from "express";
import { InterfaceGetCertificatesUseCase } from "./getCertificadosUseCase";

export class GetCertificatesController {
  constructor(private readonly useCase: InterfaceGetCertificatesUseCase) { }
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const certificates = await this.useCase.execute()
      return response.status(201).json(certificates)
    } catch (error:any) {
      return response.status(400).json({
        code: response.statusCode,
        message: error.message
      })
    }
  }
}