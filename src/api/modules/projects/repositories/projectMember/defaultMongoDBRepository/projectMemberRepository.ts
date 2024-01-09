import { 
  ProjectMemberModel,
  ProjectMemberType,
} from "../../../entities/projectMember.entity";
import type { ProjectMemberRepository as InterfaceProjectMemberRepository } from "..";
import { DefaultMongoDBRepository } from ".";
export type ProjectMemberData = {
  nome?: string,
  email?: string,
  linkedin?: string | undefined,
  github?: string | undefined,
  urlImg?: string | undefined,
  role?: string,
  statement?: string | undefined
};
export class ProjectMemberMongoDBRepository
  extends DefaultMongoDBRepository<ProjectMemberType>
  implements InterfaceProjectMemberRepository {
  constructor(private projectmemberModel = ProjectMemberModel) {
    super(projectmemberModel);
  }
  public async list(): Promise<ProjectMemberType[]> {
    const projectmembers = this.projectmemberModel.find();
    const result = (await projectmembers).map((projectmember) => {
      const result: ProjectMemberType = projectmember.toJSON();
      return result;
    });
    return result;
  }
  public async getByName(nome: string): Promise<ProjectMemberType | undefined> {
    const projectmember = await this.projectmemberModel.findOne({ nome });
    const result: ProjectMemberType | undefined = projectmember?.toJSON();
    return result;
  }
  public async getByEmail(email: string): Promise<ProjectMemberType | undefined> {
    const projectmember = await this.projectmemberModel.findOne({ email });
    const result: ProjectMemberType | undefined = projectmember?.toJSON();
    return result;
  }
  public async create(
    data: ProjectMemberType
  ): Promise<ProjectMemberType | undefined> {
    const model = new this.projectmemberModel(data);
    const createdData = await model.save();
    if (!createdData) {
      throw new Error("Failed to create new Data");
    }
    const result: ProjectMemberType = createdData.toJSON<ProjectMemberType>();
    return result;
  }
  public async deleteByName(nome: string): Promise<ProjectMemberType | undefined> {
    const deletedMember = await this.projectmemberModel.findOne({ nome });
    if (!deletedMember) {
      return;
    }
    await deletedMember.deleteOne();
    return deletedMember.toJSON<ProjectMemberType>();
  }
  public async update(
    nome: string,
    data: ProjectMemberData
  ): Promise<ProjectMemberType | undefined> {
    const updatedMember = await this.projectmemberModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedMember) {
      return;
    }
    return updatedMember.toJSON<ProjectMemberType>();
  }
}
