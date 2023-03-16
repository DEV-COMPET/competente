import { Certificates, CertificatesType } from "../../entities/certificados.entity";
import { CertificateRepository as InterfaceCertificateRepository } from "../../repositories";
export interface InterfaceCreateCertificatesUseCase{
  execute:(request:CertificatesType)=>Promise<CertificatesType>
}
export class CreateCertificatesUseCase implements InterfaceCreateCertificatesUseCase{
constructor(private readonly repository:InterfaceCertificateRepository){}
async execute (request: CertificatesType) : Promise<CertificatesType>{
  const certificatesExists = await this.repository.getByLink(request.link)
  const anotherCertificates = await this.repository.getByTitulo(request.titulo)
  if(!certificatesExists && !anotherCertificates){
    const createdCertificates = new Certificates(request)
    await this.repository.create(createdCertificates)
    return createdCertificates
  }
  throw new Error('O Certificado já se encontra cadastrado na nossa base de dados!');
}
}