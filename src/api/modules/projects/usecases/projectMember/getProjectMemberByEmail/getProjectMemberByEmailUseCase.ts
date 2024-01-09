import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ProjectMemberType } from "../../../entities/projectMember.entity";
import { ProjectMemberRepository as InterfaceProjectMemberRepository } from "../../../repositories/projectMember";

interface GetProjectMemberByEmailUseCaseRequest {
    email: string
}

type GetProjectMemberByEmailUseCaseResponse = Either<
    ResourceNotFoundError,
    { projectmember: ProjectMemberType }
>


export class GetProjectMemberByEmailUseCase {

    constructor(private readonly repository: InterfaceProjectMemberRepository) { }

    async execute({ email }: GetProjectMemberByEmailUseCaseRequest): Promise<GetProjectMemberByEmailUseCaseResponse> {
        const projectmember = await this.repository.getByName(email);

        if (!projectmember)
            return left(new ResourceNotFoundError("ProjectMember"))

        return right({ projectmember });
    }
}
