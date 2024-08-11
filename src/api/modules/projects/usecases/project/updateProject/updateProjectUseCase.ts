import { ProjectRepository } from "../../../repositories/project";
import { ProjectType } from "../../../entities/project.entity";
import { ProjectData } from "../../../repositories/project/defaultMongoDBRepository/projectRepository";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"

interface UpdateProjectUseCaseRequest {
  nome: string
  updatedDate: ProjectData
}

type UpdateProjectUseCaseResponse = Either<
  ResourceNotFoundError,
  { updatedMember: ProjectType }
>

export class UpdateProjectUseCase {

  constructor(private repository: ProjectRepository) { }

  async execute({ nome, updatedDate }: UpdateProjectUseCaseRequest): Promise<UpdateProjectUseCaseResponse> {
    const member = await this.repository.getByName(nome);

    if (!member)
      return left(new ResourceNotFoundError("Project a ser Atualizado"));

    const updatedMember = await this.repository.update(nome, updatedDate) as ProjectType;

    return right({ updatedMember });
  }
}
