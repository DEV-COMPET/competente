import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ProjectMemberType } from "../../../entities/projectMember.entity";
import type { ProjectMemberRepository as InterfaceDeleteProjectMemberRepository } from "../../../repositories/projectMember";

interface DeleteProjectMemberUseCaseRequest {
  nome: string;
}

type DeleteProjectMemberUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedMember: ProjectMemberType }
>

export class DeleteProjectMemberUseCase {

  constructor(private repository: InterfaceDeleteProjectMemberRepository) { }

  async execute({ nome }: DeleteProjectMemberUseCaseRequest): Promise<DeleteProjectMemberUseCaseResponse> {

    const deletedMember = await this.repository.deleteByName(nome);

    if (!deletedMember)
      return left(new ResourceNotFoundError("User"));

    return right({ deletedMember });
  }
}
