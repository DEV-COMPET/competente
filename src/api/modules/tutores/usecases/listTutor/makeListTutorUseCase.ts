
import { TutorMongoDBRepository } from "../../repositories/defaultMongoDBRepository/tutorRepository"
import { ListTutorUseCase } from "./listTutorUseCase"

export function makeListTutorUseCase() {
    const usersRepository = new TutorMongoDBRepository()
    const useCase = new ListTutorUseCase(usersRepository)

    return useCase
}