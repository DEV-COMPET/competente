import { MateriasRepository } from "../../repositories/defaultMongoDBRepository/materiasRepository"
import { ListMateriasUseCase } from "./listMateriaUseCase"

export function makeListMateriasUseCase() {
    const usersRepository = new MateriasRepository()
    const useCase = new ListMateriasUseCase(usersRepository)

    return useCase
}