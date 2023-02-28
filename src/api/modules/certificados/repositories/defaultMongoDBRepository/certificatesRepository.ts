import { CertificatesModel,CertificatesType } from "../../entities/certificados.entity";
import type { CertificateRepository as InterfaceCertificateRepository } from "..";
import { DefaultMongoDBRepository } from ".";
export class CertificatesRepository extends DefaultMongoDBRepository<CertificatesType> implements InterfaceCertificateRepository{
  public async deleteByLink(link: string): Promise<CertificatesType | undefined> {
    const deletedCertificates = await this.certificateModel.findOne({link})
    if(!deletedCertificates){
      return
    }
    await deletedCertificates.delete()
    return deletedCertificates.toJSON<CertificatesType>()
  }
  public async create(data: CertificatesType):Promise<CertificatesType | undefined> {
    const model = new this.certificateModel(data)
    const createdData = await model.save()
    if(!createdData){
      throw new Error("Could not register certificates")
    }
    const result : CertificatesType = createdData.toJSON<CertificatesType>()
    return result
  }
  constructor(private certificateModel = CertificatesModel) {
    super (certificateModel);
  }
  public async list(): Promise<CertificatesType[]>{
    const certificatesList= this.certificateModel.find()
    return (await certificatesList).map(certificates=>{
      const result : CertificatesType = certificates.toJSON()
      return result
    })
  }
 
}