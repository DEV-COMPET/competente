import mongoose from "mongoose";

export type CompetianoType = {
  nome: string;
  data_inicio: Date;
  email: string;
  membro_ativo?: boolean;
  tutor?: boolean;
  scrum_master?: boolean;
  intercambio?: boolean;
  data_fim?: Date | undefined;
  lates?: string | undefined;
  linkedin?: string | undefined;
  depoimentos?: string | undefined;
  url_imagem?: string | undefined;
  advertencias?: number | undefined
};
export class Competiano implements CompetianoType {
  nome: string;
  data_inicio: Date;
  email: string;
  membro_ativo?: boolean;
  tutor?: boolean;
  scrum_master?: boolean;
  intercambio?: boolean;
  data_fim?: Date | undefined;
  lates?: string | undefined;
  linkedin?: string | undefined;
  depoimentos?: string | undefined;
  url_imagem?: string | undefined;
  advertencias: number;
  constructor(competiano: CompetianoType) {
    this.url_imagem = competiano.url_imagem || "";
    this.nome = competiano.nome;
    this.email = competiano.email;
    this.data_inicio = competiano.data_inicio;
    this.intercambio = !!competiano.intercambio;
    this.scrum_master = !!competiano.scrum_master;
    this.tutor = !!competiano.tutor;
    this.membro_ativo = competiano.membro_ativo || true;
    this.depoimentos = competiano.depoimentos || "";
    this.linkedin = competiano.linkedin || "";
    this.lates = competiano.lates || "";
    this.data_fim = competiano.data_fim || new Date("05/09/1899");
    this.advertencias = 0
  }
}
export interface existentCompetiano extends CompetianoType {
  id: string;
}
const schema = new mongoose.Schema<CompetianoType>(
  {
    nome: { type: String, required: true },
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
    advertencias: { type: Number, required: true, default: 0 }
  },

  {
    versionKey: false,
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
export const CompetianoModel = mongoose.model<CompetianoType>(
  "membros",
  schema
);
