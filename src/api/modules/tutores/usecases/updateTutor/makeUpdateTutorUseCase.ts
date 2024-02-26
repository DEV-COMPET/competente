import { TutorMongoDBRepository } from "../../repositories/defaultMongoDBRepository/tutorRepository"
import { UpdateTutorUseCase } from "./updateTutorUseCase"

export function makeUpdateTutorUseCase() {
    const usersRepository = new TutorMongoDBRepository()
    const useCase = new UpdateTutorUseCase(usersRepository)

    return useCase
}