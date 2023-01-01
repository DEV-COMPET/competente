import mongoose from "mongoose"

export type CompetianoType = {
  name: string
  data_inicio: Date
  data_fim?: Date
  email: string
  lates?: string
  linkedin?: string
  membro_ativo: boolean
  tutor: boolean
  scrum_master: boolean
  intercambio: boolean
  depoimentos?: string
  url_imagem?: string
}
type competianoConstructor = {
  name: string
  data_inicio: Date
  email: string
  url_imagem?: string
}
export class Competiano implements CompetianoType {
  name: string
  data_inicio: Date
  data_fim?: Date | undefined
  email: string
  lates?: string | undefined
  linkedin?: string | undefined
  membro_ativo: boolean
  tutor: boolean
  scrum_master: boolean
  intercambio: boolean
  depoimentos?: string | undefined
  url_imagem?: string | undefined
  constructor({ name, data_inicio, email, url_imagem }: competianoConstructor) {
    this.url_imagem = url_imagem
    this.name = name
    this.email = email
    this.data_inicio = data_inicio
    this.intercambio = false
    this.scrum_master = false
    this.tutor = false
    this.membro_ativo = true
  }
}
export interface existentCompetiano extends CompetianoType{
  id:string
}
const schema = new mongoose.Schema<CompetianoType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    data_inicio: { type: Date, required: true },
    data_fim: { type: Date, required: false },
    lates: { type: String, required: false },
    linkedin: { type: String, required: false },
    membro_ativo: { type: Boolean, required: false },
    tutor: { type: Boolean, required: false },
    scrum_master: { type: Boolean, required: false },
    intercambio: { type: Boolean, required: false },
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
export const CompetianoModel = mongoose.model<CompetianoType>("membros",schema)