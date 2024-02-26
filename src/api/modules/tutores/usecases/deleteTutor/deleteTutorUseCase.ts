import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";
import { TutorType } from "../../entities/tutor.entity";
import type { TutorRepository as InterfaceDeleteTutorRepository } from "../../repositories";

interface DeleteTutorUseCaseRequest {
  nome: string;
}

type DeleteTutorUseCaseResponse = Either<
  ResourceNotFoundError,
  { deletedMember: TutorType }
>

export class DeleteTutorUseCase {

  constructor(private repository: InterfaceDeleteTutorRepository) { }

  async execute({ nome }: DeleteTutorUseCaseRequest): Promise<DeleteTutorUseCaseResponse> {

    const deletedMember = await this.repository.deleteByName(nome);

    if (!deletedMember)
      return left(new ResourceNotFoundError("User"));

    return right({ deletedMember });
  }
}
