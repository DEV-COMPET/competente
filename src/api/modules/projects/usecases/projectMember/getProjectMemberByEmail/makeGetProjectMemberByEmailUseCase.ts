import { ProjectMemberMongoDBRepository } from "../../../repositories/defaultMongoDBRepository/projectMemberRepository"
import { GetProjectMemberByEmailUseCase } from "./getProjectMemberByEmailUseCase"

export function makeGetProjectMemberByEmailUseCase() {
    const usersRepository = new ProjectMemberMongoDBRepository()
    const useCase = new GetProjectMemberByEmailUseCase(usersRepository)

    return useCase
}