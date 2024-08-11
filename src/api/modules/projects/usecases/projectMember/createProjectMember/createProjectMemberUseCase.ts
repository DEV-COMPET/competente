import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ProjectMemberRepository as InterfaceCreateProjectMemberRepository } from "../../../repositories/projectMember";
import { Either, left, right } from "@/api/@types/either";
import { ProjectMember } from "../../../entities/projectMember.entity";

interface CreateProjectMemberUseCaseRequest {
  nome: string,
  email: string,
  linkedin?: string | undefined,
  github?: string | undefined,
  urlImg?: string | undefined,
  role: string,
  statement?: string | undefined
}

type CreateProjectMemberUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { projectmember: ProjectMember }
>

export class CreateProjectMemberUseCase {
  constructor(private readonly repository: InterfaceCreateProjectMemberRepository) { }

  async execute({ nome, email, role, github, linkedin, statement, urlImg }: CreateProjectMemberUseCaseRequest): Promise<CreateProjectMemberUseCaseResponse> {

    const projectmemberExists = await this.repository.getByName(nome);

    if (projectmemberExists)
      return left(new ResourceAlreadyExistsError("ProjectMember"))

    const projectmember = new ProjectMember({
      email, nome, role, github, linkedin, statement, urlImg,
    });

    await this.repository.create(projectmember);

    return right({ projectmember });
  }
}
