import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { CertificateRepository as InterfaceCertificateRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Certificates, CertificatesType } from "../../entities/certificados.entity";
import { DatabaseInternalError } from "@/api/errors/databaseInternalError";

interface CreateCertificatesUseCaseRequest {
    certificates: CertificatesType
}

type CreateCertificatesUseCaseResponse = Either<
    ResourceAlreadyExistsError | DatabaseInternalError,
    { createdCertificates: Certificates }
>

export class CreateCertificatesUseCase {
    constructor(private readonly repository: InterfaceCertificateRepository) { }

    async execute({ certificates }: CreateCertificatesUseCaseRequest): Promise<CreateCertificatesUseCaseResponse> {

        const certificatesExists = await this.repository.getByLink(certificates.link);
        const anotherCertificates = await this.repository.getByTitulo(certificates.titulo);

        if (certificatesExists || anotherCertificates)
            return left(new ResourceAlreadyExistsError("Certificado no banco de Dados"))

        const createdCertificates = new Certificates(certificates);

        try {
            await this.repository.create(createdCertificates);
            return right({ createdCertificates });

        } catch (error) {
            console.error(error);
            return left(new DatabaseInternalError("Ocorreu um erro ao tentar criar o certificado, por favor tente novamente mais tarde!"))
        }
    }

}
