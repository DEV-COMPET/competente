import mongoose from "mongoose";
import { TutorType, tutorSchema } from "../../tutores/entities/tutor.entity";
import { ParceiroType, parceiroSchema } from "../../parceiros/entities/parceiro.entity";
import { projectMemberSchema } from "./projectMember.entity";

export type ProjectType = {
  nome: string,
  descricao: string,
  data_inicio: Date,
  thumb: string,
  members: ProjectType[],
  tutors: TutorType[],
  partners: ParceiroType[]
};

export class Project implements ProjectType {
  nome: string;
  descricao: string;
  data_inicio: Date;
  thumb: string;
  members: ProjectType[];
  tutors: TutorType[];
  partners: ParceiroType[];

  constructor(project: ProjectType) {
    this.nome = project.nome;
    this.descricao = project.descricao;
    this.data_inicio = project.data_inicio;
    this.thumb = project.thumb;
    this.members = project.members;
    this.tutors = project.tutors;
    this.partners = project.partners;
  }

}
export interface existentProject extends ProjectType {
  id: string;
}
const schema = new mongoose.Schema<ProjectType>(
  {
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    data_inicio: { type: Date, required: true },
    thumb: { type: String, required: true },
    members: { type: [projectMemberSchema], required: true },
    tutors: { type: [tutorSchema], required: true },
    partners: { type: [parceiroSchema], required: true },
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
export const ProjectModel = mongoose.model<ProjectType>(
  "projects",
  schema
);
