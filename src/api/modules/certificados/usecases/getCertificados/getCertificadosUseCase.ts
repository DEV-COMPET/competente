import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { CertificateRepository as InterfaceCertificateRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { CertificatesType } from "../../entities/certificados.entity";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

type GetCertificadosUseCaseResponse = Either<
    ResourceAlreadyExistsError,
    { certificates: CertificatesType[] }
>

export class GetCertificadosUseCase {

    constructor(private readonly repository: InterfaceCertificateRepository) { }

    async execute(): Promise<GetCertificadosUseCaseResponse> {

        const certificates = await this.repository.list()

        if (!certificates)
            return left(new ResourceNotFoundError("Certificados no DB"))

        return right({ certificates })
    }

}
