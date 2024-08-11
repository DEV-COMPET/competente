import { TalksRepository } from "../../repositories/defaultMongoDBRepository/talksRepository"
import { FindTalksByTitleUseCase } from "./findTalksByTitleUseCase"

export function makeFindTalksByTitleUseCase() {
    const usersRepository = new TalksRepository()
    const useCase = new FindTalksByTitleUseCase(usersRepository)

    return useCase
}