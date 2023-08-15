import { CertificatesType } from "../../entities/certificados.entity";
import { CertificateRepository as InterfaceCertificateRepository } from "../../repositories";
export interface InterfaceGetByTittleCertificatesUseCase {
  execute: (titulo:string) => Promise<CertificatesType>
}
export class GetCertificatesByTittleUseCase implements InterfaceGetByTittleCertificatesUseCase {
  constructor(private readonly repository: InterfaceCertificateRepository) { }
  async execute(titulo:string): Promise<CertificatesType> {
    const certificates = await this.repository.getByTitulo(titulo)
    if (!certificates) {
      throw new Error('Não existe nenhum certificado com esse titulo cadastrado')
    }
    return certificates
  }
}