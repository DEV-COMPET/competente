import { TutorRepository } from "../../repositories";
import { TutorType } from "../../entities/tutor.entity";
import { MemberData } from "../../repositories/defaultMongoDBRepository/tutorRepository";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"

interface UpdateTutorUseCaseRequest {
  nome: string
  updatedDate: MemberData
}

type UpdateTutorUseCaseResponse = Either<
  ResourceNotFoundError,
  { updatedMember: TutorType }
>

export class UpdateTutorUseCase {

  constructor(private repository: TutorRepository) { }

  async execute({ nome, updatedDate }: UpdateTutorUseCaseRequest): Promise<UpdateTutorUseCaseResponse> {
    const member = await this.repository.getByName(nome);

    if (!member)
      return left(new ResourceNotFoundError("Tutor a ser Atualizado"));

    const updatedMember = await this.repository.update(nome, updatedDate) as TutorType;

    return right({ updatedMember });
  }
}
