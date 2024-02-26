import { ParceiroMongoDBRepository } from "../../repositories/defaultMongoDBRepository/parceiroRepository"
import { ListParceiroUseCase } from "./listParceiroUseCase"

export function makeListParceiroUseCase() {
    const usersRepository = new ParceiroMongoDBRepository()
    const useCase = new ListParceiroUseCase(usersRepository)

    return useCase
}