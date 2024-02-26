import { Either, right } from "@/api/@types/either";
import { ProjectType } from "../../../entities/project.entity";
import { ProjectRepository as InterfaceProjectRepository } from "../../../repositories/project";

type ListProjectUseCaseResponse = Either<
  null,
  { projects: ProjectType[] }
>

export class ListProjectUseCase {

  constructor(private readonly repository: InterfaceProjectRepository) { }

  async execute(): Promise<ListProjectUseCaseResponse> {
    const projects = await this.repository.list();
    return right({ projects });
  }
}
