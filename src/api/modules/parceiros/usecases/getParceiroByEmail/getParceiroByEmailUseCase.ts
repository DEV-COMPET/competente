import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ParceiroType } from "../../entities/parceiro.entity";
import { ParceiroRepository as InterfaceParceiroRepository } from "../../repositories";

interface GetParceiroByEmailUseCaseRequest {
    email: string
}

type GetParceiroByEmailUseCaseResponse = Either<
    ResourceNotFoundError,
    { parceiro: ParceiroType }
>


export class GetParceiroByEmailUseCase {

    constructor(private readonly repository: InterfaceParceiroRepository) { }

    async execute({ email }: GetParceiroByEmailUseCaseRequest): Promise<GetParceiroByEmailUseCaseResponse> {
        const parceiro = await this.repository.getByName(email);

        if (!parceiro)
            return left(new ResourceNotFoundError("Parceiro"))

        return right({ parceiro });
    }
}
