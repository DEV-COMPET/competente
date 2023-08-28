import { CertificatesRepository } from "../../repositories/defaultMongoDBRepository/certificadosRepository"
import { GetCertificadosUseCase } from "./getCertificadosUseCase"

export function makeGetCertificadosUseCase() {
    const usersRepository = new CertificatesRepository()
    const useCase = new GetCertificadosUseCase(usersRepository)

    return useCase
}