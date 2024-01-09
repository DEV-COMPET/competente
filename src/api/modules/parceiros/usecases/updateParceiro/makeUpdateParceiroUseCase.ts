import { ParceiroMongoDBRepository } from "../../repositories/defaultMongoDBRepository/parceiroRepository"
import { UpdateParceiroUseCase } from "./updateParceiroUseCase"

export function makeUpdateParceiroUseCase() {
    const usersRepository = new ParceiroMongoDBRepository()
    const useCase = new UpdateParceiroUseCase(usersRepository)

    return useCase
}