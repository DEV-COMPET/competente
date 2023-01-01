import mongoose from "mongoose"

export type CompetianoType = {
  name: string
  data_inicio: Date
  email: string
  membro_ativo?: boolean
  tutor?: boolean
  scrum_master?: boolean
  intercambio?: boolean
  data_fim?: Date | undefined
  lates?: string | undefined
  linkedin?: string | undefined
  depoimentos?: string | undefined
  url_imagem?: string | undefined
}
export class Competiano implements CompetianoType {
  name: string
  data_inicio: Date
  email: string
  membro_ativo?: boolean
  tutor?: boolean
  scrum_master?: boolean
  intercambio?: boolean
  data_fim?: Date | undefined
  lates?: string | undefined
  linkedin?: string | undefined
  depoimentos?: string | undefined
  url_imagem?: string | undefined
  constructor(competiano: CompetianoType) {
    if(!this.validateEmail(competiano.email)){
      throw new Error("Email inválido")
    }
    if(!competiano.linkedin||!this.validateLinkedin(competiano.linkedin)){      
      throw new Error("Erro de validação, por favor forneça uma url válida para o perfil do linkedin do novo membro!")
    }
    if(!competiano.url_imagem||!this.validateImgUrl(competiano.url_imagem)){
      throw new Error("Erro de validação, por favor forneça uma url válida do imgbb para a foto do novo membro!")
    }
    this.url_imagem = competiano.url_imagem
    this.name = competiano.name
    this.email = competiano.email
    this.data_inicio = competiano.data_inicio
    this.intercambio = !!competiano.intercambio
    this.scrum_master = !!competiano.scrum_master
    this.tutor = !!competiano.tutor
    this.membro_ativo = competiano.membro_ativo || true
    this.depoimentos = competiano.depoimentos || ""
    this.linkedin = competiano.linkedin 
    this.lates = competiano.lates || ""
    this.data_fim = competiano.data_fim || new Date("05/09/1899")
  }
  validateEmail(email: string): boolean {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email.toLocaleLowerCase())
  }
  validateLinkedin(linkedin: string): boolean {
    const regexp = /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/
    return regexp.test(linkedin)
  }
  validateImgUrl(url_imagem:string):boolean{
    const regexp=/^https:\/\/[a-z]{2,3}\.compet.imgbb\.com\/.*$/
    return regexp.test(url_imagem)
  }
}
export interface existentCompetiano extends CompetianoType {
  id: string
}
const schema = new mongoose.Schema<CompetianoType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    data_inicio: { type: Date, required: true },
    data_fim: { type: Date, required: true },
    lates: { type: String, required: false },
    linkedin: { type: String, required: false },
    membro_ativo: { type: Boolean, required: true },
    tutor: { type: Boolean, required: true },
    scrum_master: { type: Boolean, required: true },
    intercambio: { type: Boolean, required: true },
    depoimentos: { type: String, required: false },
    url_imagem: { type: String, required: false },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
      }
    },
  },
)
export const CompetianoModel = mongoose.model<CompetianoType>("membros", schema)