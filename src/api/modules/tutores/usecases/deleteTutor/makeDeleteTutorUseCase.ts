import { TutorMongoDBRepository } from "../../repositories/defaultMongoDBRepository/tutorRepository"
import { DeleteTutorUseCase } from "./deleteTutorUseCase"

export function makeDeleteTutorUseCase() {
    const usersRepository = new TutorMongoDBRepository()
    const useCase = new DeleteTutorUseCase(usersRepository)

    return useCase
}