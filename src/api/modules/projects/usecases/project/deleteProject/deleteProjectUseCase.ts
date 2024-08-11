import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ProjectType } from "../../../entities/project.entity";
import type { ProjectRepository as InterfaceDeleteProjectRepository } from "../../../repositories/project";

interface DeleteProjectUseCaseRequest {
  nome: string;
}

type DeleteProjectUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedMember: ProjectType }
>

export class DeleteProjectUseCase {

  constructor(private repository: InterfaceDeleteProjectRepository) { }

  async execute({ nome }: DeleteProjectUseCaseRequest): Promise<DeleteProjectUseCaseResponse> {

    const deletedMember = await this.repository.deleteByName(nome);

    if (!deletedMember)
      return left(new ResourceNotFoundError("User"));

    return right({ deletedMember });
  }
}
