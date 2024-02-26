import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { ParceiroRepository as InterfaceCreateParceiroRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Parceiro } from "../../entities/parceiro.entity";

interface CreateParceiroUseCaseRequest {
  nome: string;
  imgUrl: string,
  url: string,
}

type CreateParceiroUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { parceiro: Parceiro }
>

export class CreateParceiroUseCase {
  constructor(private readonly repository: InterfaceCreateParceiroRepository) { }

  async execute({ imgUrl, nome, url }: CreateParceiroUseCaseRequest): Promise<CreateParceiroUseCaseResponse> {

    const parceiroExists = await this.repository.getByName(nome);

    if (parceiroExists)
      return left(new ResourceAlreadyExistsError("Parceiro"))


    const parceiro = new Parceiro({
      imgUrl, nome, url
    });

    await this.repository.create(parceiro);

    return right({ parceiro });
  }
}
