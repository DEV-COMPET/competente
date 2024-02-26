import { ProjectMemberRepository } from "../../../repositories/projectMember";
import { ProjectMemberType } from "../../../entities/projectMember.entity";
import { ProjectMemberData } from "../../../repositories/projectMember/defaultMongoDBRepository/projectMemberRepository";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"

interface UpdateProjectMemberUseCaseRequest {
  nome: string
  updatedDate: ProjectMemberData
}

type UpdateProjectMemberUseCaseResponse = Either<
  ResourceNotFoundError,
  { updatedMember: ProjectMemberType }
>

export class UpdateProjectMemberUseCase {

  constructor(private repository: ProjectMemberRepository) { }

  async execute({ nome, updatedDate }: UpdateProjectMemberUseCaseRequest): Promise<UpdateProjectMemberUseCaseResponse> {
    const member = await this.repository.getByName(nome);

    if (!member)
      return left(new ResourceNotFoundError("ProjectMember a ser Atualizado"));

    const updatedMember = await this.repository.update(nome, updatedDate) as ProjectMemberType;

    return right({ updatedMember });
  }
}
