import { ProjectMongoDBRepository } from "../../../repositories/project/defaultMongoDBRepository/projectRepository"
import { DeleteProjectUseCase } from "./deleteProjectUseCase"

export function makeDeleteProjectUseCase() {
    const usersRepository = new ProjectMongoDBRepository()
    const useCase = new DeleteProjectUseCase(usersRepository)

    return useCase
}