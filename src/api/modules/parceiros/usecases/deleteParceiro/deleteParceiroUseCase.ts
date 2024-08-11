import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { ParceiroType } from "../../entities/parceiro.entity";
import type { ParceiroRepository as InterfaceDeleteParceiroRepository } from "../../repositories";

interface DeleteParceiroUseCaseRequest {
  nome: string;
}

type DeleteParceiroUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedMember: ParceiroType }
>

export class DeleteParceiroUseCase {

  constructor(private repository: InterfaceDeleteParceiroRepository) { }

  async execute({ nome }: DeleteParceiroUseCaseRequest): Promise<DeleteParceiroUseCaseResponse> {

    const deletedMember = await this.repository.deleteByName(nome);

    if (!deletedMember)
      return left(new ResourceNotFoundError("User"));

    return right({ deletedMember });
  }
}
