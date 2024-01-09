import { ProjectMemberMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/projectMemberRepository"
import { DeleteProjectMemberUseCase } from "./deleteProjectMemberUseCase"

export function makeDeleteProjectMemberUseCase() {
    const usersRepository = new ProjectMemberMongoDBRepository()
    const useCase = new DeleteProjectMemberUseCase(usersRepository)

    return useCase
}