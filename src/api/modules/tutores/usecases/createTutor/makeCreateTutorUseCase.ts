import { TutorMongoDBRepository } from "../../repositories/defaultMongoDBRepository/tutorRepository"
import { CreateTutorUseCase } from "./createTutorUseCase"

export function makeCreateTutorUseCase() {
    const usersRepository = new TutorMongoDBRepository()
    const useCase = new CreateTutorUseCase(usersRepository)

    return useCase
}