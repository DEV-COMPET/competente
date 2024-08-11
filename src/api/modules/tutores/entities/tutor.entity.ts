import mongoose from "mongoose";

export type TutorType = {
  nome: string;
  email: string;
  linkedin?: string | undefined;
  resumo?: string | undefined;
  urlImg?: string | undefined;
};
export class Tutor implements TutorType {
  nome: string;
  email: string;
  linkedin?: string | undefined;
  resumo?: string | undefined;
  urlImg?: string | undefined;
  constructor(tutor: TutorType) {
    this.nome = tutor.nome;
    this.email = tutor.email;
    this.linkedin = tutor.linkedin;
    this.resumo = tutor.resumo;
    this.urlImg = tutor.urlImg;
  }
}
export interface existentTutor extends TutorType {
  id: string;
}
export const tutorSchema = new mongoose.Schema<TutorType>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: { type: String, required: false },
    resumo: { type: String, required: false },
    urlImg: { type: String, required: false },
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
export const TutorModel = mongoose.model<TutorType>(
  "tutores",
  tutorSchema
);
