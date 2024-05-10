import mongoose from "mongoose";

export type MateriasType = {
  nome: string 
  periodo: string
  natureza: string
  corequisitos: string[]
  prerequisitos: string[]
}

export class Materias implements MateriasType {
  nome: string
  periodo: string
  natureza: string
  corequisitos: string[]
  prerequisitos: string[]
  constructor(materia:MateriasType){
    this.nome=materia.nome
    this.periodo=materia.periodo
    this.natureza=materia.natureza
    this.corequisitos=materia.corequisitos
    this.prerequisitos=materia.prerequisitos
  }
}

const schema = new mongoose.Schema<MateriasType>({
  nome: {type: String, required: true},
  periodo: {type: String, required: true},
  natureza: {type: String, required: true},
  corequisitos: {type: [String], required: false},
  prerequisitos: {type: [String], required: false}
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
export const MateriasModel = mongoose.model<MateriasType>("materias",schema)
