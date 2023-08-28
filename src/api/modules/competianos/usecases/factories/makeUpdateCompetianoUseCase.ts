import { CompetianoMongoDBRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository"
import { UpdateCompetianoUseCase } from "../source/updateCompetianoUseCase"

export function makeUpdateCompetianoUseCase() {
    const usersRepository = new CompetianoMongoDBRepository()
    const useCase = new UpdateCompetianoUseCase(usersRepository)

    return useCase
}