import { Either, right } from "@/api/@types/either";
import { MateriasType } from "../../entities/materias.entity";
import { MateriaRepository as InterfaceMateriasRepository } from "../../repositories";

type ListMateriasUseCaseResponse = Either<
    null,
    { materias: MateriasType[] }
>

export class ListMateriasUseCase {

    constructor(private readonly repository: InterfaceMateriasRepository) {}

    async execute(): Promise<ListMateriasUseCaseResponse> {
      const materias = await this.repository.list();
      return right({materias});
    }
  }
