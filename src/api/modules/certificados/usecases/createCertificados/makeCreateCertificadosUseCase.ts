import { CertificatesRepository } from "../../repositories/defaultMongoDBRepository/certificadosRepository"
import { CreateCertificatesUseCase } from "./createCertificadosUseCase"

export function makeCreateCertificateUseCase() {
    const usersRepository = new CertificatesRepository()
    const useCase = new CreateCertificatesUseCase(usersRepository)

    return useCase
}