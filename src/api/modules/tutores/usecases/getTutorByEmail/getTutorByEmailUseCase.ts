import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { TutorType } from "../../entities/tutor.entity";
import { TutorRepository as InterfaceTutorRepository } from "../../repositories";

interface GetTutorByEmailUseCaseRequest {
    email: string
}

type GetTutorByEmailUseCaseResponse = Either<
    ResourceNotFoundError,
    { tutor: TutorType }
>


export class GetTutorByEmailUseCase {

    constructor(private readonly repository: InterfaceTutorRepository) { }

    async execute({ email }: GetTutorByEmailUseCaseRequest): Promise<GetTutorByEmailUseCaseResponse> {
        const tutor = await this.repository.getByName(email);

        if (!tutor)
            return left(new ResourceNotFoundError("Tutor"))

        return right({ tutor });
    }
}
