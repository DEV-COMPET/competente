import { ProjectMemberMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/projectMemberRepository"
import { UpdateProjectMemberUseCase } from "./updateProjectMemberUseCase"

export function makeUpdateProjectMemberUseCase() {
    const usersRepository = new ProjectMemberMongoDBRepository()
    const useCase = new UpdateProjectMemberUseCase(usersRepository)

    return useCase
}