import { TalksRepository } from "../../repositories/defaultMongoDBRepository/talksRepository"
import { CreateTalksUseCase } from "./createTalksUseCase"

export function makeCreateTalksUseCase() {
    const usersRepository = new TalksRepository()
    const useCase = new CreateTalksUseCase(usersRepository)

    return useCase
}