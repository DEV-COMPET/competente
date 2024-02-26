import { 
  ProjectModel,
  ProjectType,
} from "../../../entities/project.entity";
import type { ProjectRepository as InterfaceProjectRepository } from "..";
import { DefaultMongoDBRepository } from ".";
export type ProjectData = {
  nome?: string,
  email?: string,
  linkedin?: string | undefined,
  github?: string | undefined,
  urlImg?: string | undefined,
  role?: string,
  statement?: string | undefined
};
export class ProjectMongoDBRepository
  extends DefaultMongoDBRepository<ProjectType>
  implements InterfaceProjectRepository {
  constructor(private projectModel = ProjectModel) {
    super(projectModel);
  }
  public async list(): Promise<ProjectType[]> {
    const projects = this.projectModel.find();
    const result = (await projects).map((project) => {
      const result: ProjectType = project.toJSON();
      return result;
    });
    return result;
  }
  public async getByName(nome: string): Promise<ProjectType | undefined> {
    const project = await this.projectModel.findOne({ nome });
    const result: ProjectType | undefined = project?.toJSON();
    return result;
  }
  public async getByEmail(email: string): Promise<ProjectType | undefined> {
    const project = await this.projectModel.findOne({ email });
    const result: ProjectType | undefined = project?.toJSON();
    return result;
  }
  public async create(
    data: ProjectType
  ): Promise<ProjectType | undefined> {
    const model = new this.projectModel(data);
    const createdData = await model.save();
    if (!createdData) {
      throw new Error("Failed to create new Data");
    }
    const result: ProjectType = createdData.toJSON<ProjectType>();
    return result;
  }
  public async deleteByName(nome: string): Promise<ProjectType | undefined> {
    const deletedMember = await this.projectModel.findOne({ nome });
    if (!deletedMember) {
      return;
    }
    await deletedMember.deleteOne();
    return deletedMember.toJSON<ProjectType>();
  }
  public async update(
    nome: string,
    data: ProjectData
  ): Promise<ProjectType | undefined> {
    const updatedMember = await this.projectModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedMember) {
      return;
    }
    return updatedMember.toJSON<ProjectType>();
  }
}
