import mongoose from "mongoose";

export type ParceiroType = {
  nome: string;
  imgUrl: string,
  url: string,
};
export class Parceiro implements ParceiroType {
  nome: string;
  imgUrl: string;
  url: string;

  constructor(parceiro: ParceiroType) {
    this.nome = parceiro.nome;
    this.imgUrl = parceiro.imgUrl;
    this.url = parceiro.url;
  }
}
export interface existentParceiro extends ParceiroType {
  id: string;
}

export const parceiroSchema = new mongoose.Schema<ParceiroType>(
  {
    nome: { type: String, required: true },
    imgUrl: { type: String, required: true },
    url: { type: String, required: true },
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
export const ParceiroModel = mongoose.model<ParceiroType>(
  "parceiros",
  parceiroSchema
);
