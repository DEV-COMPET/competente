import { ParceiroMongoDBRepository } from "../../repositories/defaultMongoDBRepository/parceiroRepository"
import { DeleteParceiroUseCase } from "./deleteParceiroUseCase"

export function makeDeleteParceiroUseCase() {
    const usersRepository = new ParceiroMongoDBRepository()
    const useCase = new DeleteParceiroUseCase(usersRepository)

    return useCase
}