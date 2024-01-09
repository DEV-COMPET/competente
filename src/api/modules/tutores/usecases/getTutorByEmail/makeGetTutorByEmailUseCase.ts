import { TutorMongoDBRepository } from "../../repositories/defaultMongoDBRepository/tutorRepository"
import { GetTutorByEmailUseCase } from "./getTutorByEmailUseCase"

export function makeGetTutorByEmailUseCase() {
    const usersRepository = new TutorMongoDBRepository()
    const useCase = new GetTutorByEmailUseCase(usersRepository)

    return useCase
}