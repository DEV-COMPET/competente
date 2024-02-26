import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ProjectRepository as InterfaceCreateProjectRepository } from "../../../repositories/project";
import { Either, left, right } from "@/api/@types/either";
import { Project } from "../../../entities/project.entity";

interface CreateProjectUseCaseRequest {
  nome: string,
  descricao: string,
  data_inicio: Date,
  thumb: string,
}

type CreateProjectUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { project: Project }
>

export class CreateProjectUseCase {
  constructor(private readonly repository: InterfaceCreateProjectRepository) { }

  async execute({ data_inicio, descricao, nome, thumb }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {

    const projectExists = await this.repository.getByName(nome);

    if (projectExists)
      return left(new ResourceAlreadyExistsError("Project"))

    const project = new Project({
      data_inicio, descricao, members: [], nome, partners: [], thumb, tutors: []
    });

    await this.repository.create(project);

    return right({ project });
  }
}
