import { Either, right } from "@/api/@types/either";
import { ProjectMemberType } from "../../../entities/projectMember.entity";
import { ProjectMemberRepository as InterfaceProjectMemberRepository } from "../../../repositories/projectMember";

type ListProjectMemberUseCaseResponse = Either<
  null,
  { projectmembers: ProjectMemberType[] }
>

export class ListProjectMemberUseCase {

  constructor(private readonly repository: InterfaceProjectMemberRepository) { }

  async execute(): Promise<ListProjectMemberUseCaseResponse> {
    const projectmembers = await this.repository.list();
    return right({ projectmembers });
  }
}
