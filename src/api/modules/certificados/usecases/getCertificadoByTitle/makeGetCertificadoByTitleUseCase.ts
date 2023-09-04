import { CertificatesRepository } from "../../repositories/defaultMongoDBRepository/certificadosRepository"
import { GetCertificadoByTitleUseCase } from "./getCertificadoByTitleUseCase"

export function makeGetCertificadoByTitleUseCase() {
    const usersRepository = new CertificatesRepository()
    const useCase = new GetCertificadoByTitleUseCase(usersRepository)

    return useCase
}