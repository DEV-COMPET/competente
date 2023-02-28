import mongoose from "mongoose";
export type CertificateType = {
  titulo: string
  data: Date
  link: string
  compet_talks: boolean
  compbio: boolean
  listaNomes: string[]
}
export class Certificate implements CertificateType{
  titulo: string
  data: Date
  link: string
  compet_talks: boolean
  compbio: boolean
  listaNomes: string[]
  constructor(certificate:CertificateType){
    this.compbio=certificate.compbio
    this.compet_talks=certificate.compet_talks
    this.listaNomes=certificate.listaNomes
    this.titulo=certificate.titulo
    this.data=new Date(certificate.data)
    this.link=certificate.link
  }

}
const schema = new mongoose.Schema<CertificateType>({
  compbio:{type: Boolean,required:true},
  compet_talks:{type: Boolean,required:true},
  listaNomes:{type: [String],required:true},
  titulo:{type: String,required:true},
  data:{type: Date,required:true},
  link:{type: String,required:true}
},
{
  versionKey: false,
  toJSON:{
    transform:(_,ret):void=>{
      ret.id=ret._id.toString()
      delete ret._id
      delete ret.__v
    }
  }
}
)
export const CertificateModel = mongoose.model<CertificateType>("certifieds",schema)
