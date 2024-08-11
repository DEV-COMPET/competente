import mongoose from "mongoose";

export type ProjectMemberType = {
  nome: string,
  email: string,
  linkedin?: string | undefined,
  github?: string | undefined,
  urlImg?: string | undefined,
  role: string,
  statement?: string | undefined
};
export class ProjectMember implements ProjectMemberType {
  nome: string;
  email: string;
  linkedin?: string | undefined;
  github?: string | undefined;
  urlImg?: string | undefined;
  role: string;
  statement?: string | undefined
  constructor(projectMember: ProjectMemberType) {
    this.nome = projectMember.nome;
    this.email = projectMember.email;
    this.linkedin = projectMember.linkedin ?? ""
    this.github = projectMember.github ?? ""
    this.urlImg = projectMember.urlImg ?? ""
    this.role = projectMember.role
    this.statement = projectMember.statement ?? ""
  }
}
export interface existentProjectMember extends ProjectMemberType {
  id: string;
}
export const projectMemberSchema = new mongoose.Schema<ProjectMemberType>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: { type: String, required: false },
    github: { type: String, required: false },
    urlImg: { type: String, required: false },
    statement: { type: String, required: false },
    role: { type: String, required: true },
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
export const ProjectMemberModel = mongoose.model<ProjectMemberType>(
  "projectMembers",
  projectMemberSchema
);
