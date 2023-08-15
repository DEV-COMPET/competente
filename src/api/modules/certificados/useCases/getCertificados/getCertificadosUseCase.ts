import { CertificatesType } from "../../entities/certificados.entity";
import { CertificateRepository as InterfaceCertificateRepository } from "../../repositories";
export interface InterfaceGetCertificatesUseCase {
  execute: () => Promise<CertificatesType[]>
}
export class GetCertificatesUseCase implements InterfaceGetCertificatesUseCase {
  constructor(private readonly repository: InterfaceCertificateRepository) { }
  async execute(): Promise<CertificatesType[]> {
    const certificates = await this.repository.list()
    if (!certificates) {
      throw new Error('Não existe nenhum certificado cadastrado')
    }
    return certificates
  }
}