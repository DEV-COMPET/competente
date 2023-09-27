import { TalksRepository } from "../../repositories/defaultMongoDBRepository/talksRepository"
import { UpdateTalksUseCase } from "./updateTalksUseCase"

export function makeUpdateTalksUseCase() {
    const usersRepository = new TalksRepository()
    const useCase = new UpdateTalksUseCase(usersRepository)

    return useCase
}