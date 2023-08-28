import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { CertificateRepository as InterfaceCertificateRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Certificates } from "../../entities/certificados.entity";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

interface GetCertificadoByTitleUseCaseRequest {
    titulo: string
}

type GetCertificadoByTitleUseCaseResponse = Either<
    ResourceAlreadyExistsError,
    { certificates: Certificates }
>

export class GetCertificadoByTitleUseCase {
    constructor(private readonly repository: InterfaceCertificateRepository) { }

    async execute({ titulo }: GetCertificadoByTitleUseCaseRequest): Promise<GetCertificadoByTitleUseCaseResponse> {

        const certificates = await this.repository.getByTitulo(titulo)
        if (!certificates) 
            return left(new ResourceNotFoundError("Certificado com tal titulo no DB."))
        
        return right({ certificates })

    }

}
