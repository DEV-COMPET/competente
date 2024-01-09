import { ProjectMemberMongoDBRepository } from "../../../repositories/projectMember/defaultMongoDBRepository/projectMemberRepository"
import { UpdateProjectMemberUseCase } from "./updateProjectMemberUseCase"

export function makeUpdateProjectMemberUseCase() {
    const usersRepository = new ProjectMemberMongoDBRepository()
    const useCase = new UpdateProjectMemberUseCase(usersRepository)

    return useCase
}