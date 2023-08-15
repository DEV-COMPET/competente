import {
  Certificates,
  CertificatesType,
} from "../../entities/certificados.entity";
import { CertificateRepository as InterfaceCertificateRepository } from "../../repositories";
export interface InterfaceCreateCertificatesUseCase {
  execute: (request: CertificatesType) => Promise<CertificatesType>;
}
export class CreateCertificatesUseCase
  implements InterfaceCreateCertificatesUseCase
{
  constructor(private readonly repository: InterfaceCertificateRepository) {}
  async execute(request: CertificatesType): Promise<CertificatesType> {
    const certificatesExists = await this.repository.getByLink(request.link);
    const anotherCertificates = await this.repository.getByTitulo(
      request.titulo
    );
    if (!certificatesExists && !anotherCertificates) {
      const createdCertificates = new Certificates(request);
      try {
        await this.repository.create(createdCertificates);
        return createdCertificates;
      } catch (error) {
        console.error(error);
        throw new Error(
          "Ocorreu um erro ao tentar criar o certificado, por favor tente novamente mais tarde!"
        );
      }
    }
    throw new Error(
      "O Certificado já se encontra cadastrado na nossa base de dados!"
    );
  }
}
