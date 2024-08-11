import { ProjectMongoDBRepository } from "../../../repositories/project/defaultMongoDBRepository/projectRepository"
import { ListProjectUseCase } from "./listProjectUseCase"

export function makeListProjectUseCase() {
    const usersRepository = new ProjectMongoDBRepository()
    const useCase = new ListProjectUseCase(usersRepository)

    return useCase
}