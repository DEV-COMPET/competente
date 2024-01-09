import { ProjectMongoDBRepository } from "../../../repositories/project/defaultMongoDBRepository/projectRepository"
import { GetProjectByNameUseCase } from "./getProjectByNameUseCase"

export function makeGetProjectByNameUseCase() {
    const usersRepository = new ProjectMongoDBRepository()
    const useCase = new GetProjectByNameUseCase(usersRepository)

    return useCase
}