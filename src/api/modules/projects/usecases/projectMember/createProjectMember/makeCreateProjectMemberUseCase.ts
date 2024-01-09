import { ProjectMemberMongoDBRepository } from "../../../repositories/projectMember/defaultMongoDBRepository/projectMemberRepository"
import { CreateProjectMemberUseCase } from "./createProjectMemberUseCase"

export function makeCreateProjectMemberUseCase() {
    const usersRepository = new ProjectMemberMongoDBRepository()
    const useCase = new CreateProjectMemberUseCase(usersRepository)

    return useCase
}