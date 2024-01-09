import { ProjectMemberMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/projectMemberRepository"
import { CreateProjectMemberUseCase } from "./createProjectMemberUseCase"

export function makeCreateProjectMemberUseCase() {
    const usersRepository = new ProjectMemberMongoDBRepository()
    const useCase = new CreateProjectMemberUseCase(usersRepository)

    return useCase
}