import { Either, right } from "@/api/@types/either";
import { ParceiroType } from "../../entities/parceiro.entity";
import { ParceiroRepository as InterfaceParceiroRepository } from "../../repositories";

type ListParceiroUseCaseResponse = Either<
  null,
  { parceiros: ParceiroType[] }
>

export class ListParceiroUseCase {

  constructor(private readonly repository: InterfaceParceiroRepository) { }

  async execute(): Promise<ListParceiroUseCaseResponse> {
    const parceiros = await this.repository.list();
    return right({ parceiros });
  }
}
