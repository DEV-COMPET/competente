import { Request, Response } from "express";
import { InterfaceGetByTittleCertificatesUseCase } from "./getCertificadoByTittleUseCase";
export class GetCertificatesByTittleController {
    constructor(private readonly useCase: InterfaceGetByTittleCertificatesUseCase) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const titulo = request.params.titulo
        try {
            const certificates = await this.useCase.execute(titulo)
            return response.status(201).json(certificates)
        } catch (error: any) {
            return response.status(400).json({
                code: response.statusCode,
                message: error.message
            })
        }
    }
}