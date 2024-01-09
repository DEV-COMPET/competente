import { ProjectMemberMongoDBRepository } from "../../../repositories/projectMember/defaultMongoDBRepository/projectMemberRepository"
import { ListProjectMemberUseCase } from "./listProjectMemberUseCase"

export function makeListProjectMemberUseCase() {
    const usersRepository = new ProjectMemberMongoDBRepository()
    const useCase = new ListProjectMemberUseCase(usersRepository)

    return useCase
}