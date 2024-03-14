import { MateriasRepository } from "../../repositories/defaultMongoDBRepository/materiasRepository"
import { CreateMateriasUseCase } from "./createMateriaUseCase"

export function makeCreateMateriaUseCase() {
    const usersRepository = new MateriasRepository()
    const useCase = new CreateMateriasUseCase(usersRepository)

    return useCase
}