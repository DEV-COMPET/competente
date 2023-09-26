import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { TalksRepository as InterfaceTalksRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { DatabaseInternalError } from "@/api/errors/databaseInternalError";
import { Talks } from "../../entities/talks.entity";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

interface FindTalksByTitleUseCaseRequest {
    titulo: string
}

type FindTalksByTitleUseCaseResponse = Either<
    ResourceAlreadyExistsError | DatabaseInternalError,
    { talks: Talks }
>

export class FindTalksByTitleUseCase {
    constructor(private readonly repository: InterfaceTalksRepository) { }

    async execute({ titulo }: FindTalksByTitleUseCaseRequest): Promise<FindTalksByTitleUseCaseResponse> {

        const talksExists = await this.repository.getByTitulo(titulo);
        if (!talksExists)
            return left(new ResourceNotFoundError("Talks title"))

        const talks = new Talks(talksExists)

        return right({ talks })
    }
}
