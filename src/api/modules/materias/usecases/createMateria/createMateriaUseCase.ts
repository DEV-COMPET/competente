import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { MateriaRepository as InterfaceMateriaRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Materias, MateriasType } from "../../entities/materias.entity";
import { DatabaseInternalError } from "@/api/errors/databaseInternalError";

interface CreateMateriasUseCaseRequest {
    materia: MateriasType
}

type CreateMateriasUseCaseResponse = Either<
    ResourceAlreadyExistsError | DatabaseInternalError,
    { createdMaterias: Materias }
>

export class CreateMateriasUseCase {
    constructor(private readonly repository: InterfaceMateriaRepository) { }

    async execute({ materia }: CreateMateriasUseCaseRequest): Promise<CreateMateriasUseCaseResponse> {

        const possibleMateria = await this.repository.getByNome(materia.nome);

        if (possibleMateria)
            return left(new ResourceAlreadyExistsError(`Materia com nome ${materia.nome}`))

        const createdMaterias = new Materias(materia);

        try {
            await this.repository.create(createdMaterias);
            return right({ createdMaterias });

        } catch (error) {
            console.error(error);
            return left(new DatabaseInternalError("Ocorreu um erro ao tentar criar o certificado, por favor tente novamente mais tarde!"))
        }
    }

}
