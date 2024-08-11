import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ProjectType } from "../../../entities/project.entity";
import { ProjectRepository as InterfaceProjectRepository } from "../../../repositories/project";

interface GetProjectByNameUseCaseRequest {
    name: string
}

type GetProjectByNameUseCaseResponse = Either<
    ResourceNotFoundError,
    { project: ProjectType }
>


export class GetProjectByNameUseCase {

    constructor(private readonly repository: InterfaceProjectRepository) { }

    async execute({ name }: GetProjectByNameUseCaseRequest): Promise<GetProjectByNameUseCaseResponse> {
        const project = await this.repository.getByName(name);

        if (!project)
            return left(new ResourceNotFoundError("Project"))

        return right({ project });
    }
}
