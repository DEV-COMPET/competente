import { ParceiroMongoDBRepository } from "../../repositories/defaultMongoDBRepository/parceiroRepository"
import { CreateParceiroUseCase } from "./createParceiroUseCase"

export function makeCreateParceiroUseCase() {
    const usersRepository = new ParceiroMongoDBRepository()
    const useCase = new CreateParceiroUseCase(usersRepository)

    return useCase
}