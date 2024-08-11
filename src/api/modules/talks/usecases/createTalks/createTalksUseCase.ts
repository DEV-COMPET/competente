import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { TalksRepository as InterfaceTalksRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { DatabaseInternalError } from "@/api/errors/databaseInternalError";
import { Talks } from "../../entities/talks.entity";

interface CreateTalksUseCaseRequest {
    titulo: string
    data: Date
    palestrantes: string[]
    // TODO: youtube_link: string
}

type CreateTalksUseCaseResponse = Either<
    ResourceAlreadyExistsError | DatabaseInternalError,
    { createdTalks: Talks }
>

export class CreateTalksUseCase {
    constructor(private readonly repository: InterfaceTalksRepository) { }

    async execute({ data, palestrantes, titulo }: CreateTalksUseCaseRequest): Promise<CreateTalksUseCaseResponse> {

        const talksExists = await this.repository.getByTitulo(titulo);
        if (talksExists)
            return left(new ResourceAlreadyExistsError("Certificado no banco de Dados"))

        const createdTalks = new Talks({
            titulo, data, palestrantes /*,TODO: youtube_link*/, ativo: false
        });

        try {
            await this.repository.create(createdTalks);
        } catch (error) {
            console.error(error);
            return left(new DatabaseInternalError("Ocorreu um erro ao tentar criar o certificado, por favor tente novamente mais tarde!"))
        }
        return right({ createdTalks });
    }
}
