import { ParceiroRepository } from "../../repositories";
import { ParceiroType } from "../../entities/parceiro.entity";
import { ParceiroData } from "../../repositories/defaultMongoDBRepository/parceiroRepository";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"

interface UpdateParceiroUseCaseRequest {
  nome: string
  updatedDate: ParceiroData
}

type UpdateParceiroUseCaseResponse = Either<
  ResourceNotFoundError,
  { updatedMember: ParceiroType }
>

export class UpdateParceiroUseCase {

  constructor(private repository: ParceiroRepository) { }

  async execute({ nome, updatedDate }: UpdateParceiroUseCaseRequest): Promise<UpdateParceiroUseCaseResponse> {
    const member = await this.repository.getByName(nome);

    if (!member)
      return left(new ResourceNotFoundError("Parceiro a ser Atualizado"));

    const updatedMember = await this.repository.update(nome, updatedDate) as ParceiroType;

    return right({ updatedMember });
  }
}
