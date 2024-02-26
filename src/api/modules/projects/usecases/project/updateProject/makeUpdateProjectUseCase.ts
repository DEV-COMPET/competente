import { ProjectMongoDBRepository } from "../../../repositories/project/defaultMongoDBRepository/projectRepository"
import { UpdateProjectUseCase } from "./updateProjectUseCase"

export function makeUpdateProjectUseCase() {
    const usersRepository = new ProjectMongoDBRepository()
    const useCase = new UpdateProjectUseCase(usersRepository)

    return useCase
}