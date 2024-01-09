import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { TutorRepository as InterfaceCreateTutorRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { Tutor } from "../../entities/tutor.entity";

interface CreateTutorUseCaseRequest {
  nome: string;
  email: string;
  linkedin?: string | undefined;
  resumo?: string | undefined;
  urlImg?: string | undefined;
}

type CreateTutorUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  { tutor: Tutor }
>

export class CreateTutorUseCase {
  constructor(private readonly repository: InterfaceCreateTutorRepository) { }

  async execute({ nome, email, linkedin, resumo, urlImg }: CreateTutorUseCaseRequest): Promise<CreateTutorUseCaseResponse> {

    const tutorExists = await this.repository.getByName(nome);

    if (tutorExists)
      return left(new ResourceAlreadyExistsError("Tutor"))


    const tutor = new Tutor({
      email, nome, linkedin, resumo, urlImg
    });

    await this.repository.create(tutor);

    return right({ tutor });
  }
}
