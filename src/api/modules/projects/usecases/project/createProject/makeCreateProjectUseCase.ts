import { ProjectMongoDBRepository } from "../../../repositories/project/defaultMongoDBRepository/projectRepository"
import { CreateProjectUseCase } from "./createProjectUseCase"

export function makeCreateProjectUseCase() {
    const usersRepository = new ProjectMongoDBRepository()
    const useCase = new CreateProjectUseCase(usersRepository)

    return useCase
}