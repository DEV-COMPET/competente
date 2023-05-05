import { Request, Response } from "express";
import { CertificatesType } from "../../entities/certificados.entity";
import { InterfaceCreateCertificatesUseCase } from "./createCertificadosUseCase";

export class CreateCertificatesController {
  constructor(private readonly useCase: InterfaceCreateCertificatesUseCase) { }
  async handle(request: Request, response: Response): Promise<Response> {
    const certificates: CertificatesType = request.body
    try {
      if (certificates.listaNomes.length == 0) {
        return response.status(422).json({
          message: "Erro de input, verifique a lista de nomes cadastrada, não é possível gerar certificados para 0 pessoas!",
          code: response.statusCode
        })
      }
      if (new Date(certificates.data).getTime() > new Date().getTime()) {
        return response.status(422).json({
          message: "Data de certificado incorreta, o certificado não pode ser criado em uma data futura.",
          code: response.statusCode
        })
      }
      if (certificates.titulo.length <= 4) {
        return response.status(422).json({
          message: "Erro de input, o título do certificado deve ser maior do que 4 caracteres!",
          code: response.statusCode
        })
      }
      const certificatesCreated = await this.useCase.execute(certificates)
      return response.status(201).json(certificatesCreated)
    } catch (error:any) {
      return response.status(400).json({
        code: response.statusCode,
        message: error.message
      })
    }
  }
}