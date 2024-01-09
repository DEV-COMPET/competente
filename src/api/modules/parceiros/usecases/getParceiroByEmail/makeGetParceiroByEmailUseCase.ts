import { ParceiroMongoDBRepository } from "../../repositories/defaultMongoDBRepository/parceiroRepository"
import { GetParceiroByEmailUseCase } from "./getParceiroByEmailUseCase"

export function makeGetParceiroByEmailUseCase() {
    const usersRepository = new ParceiroMongoDBRepository()
    const useCase = new GetParceiroByEmailUseCase(usersRepository)

    return useCase
}