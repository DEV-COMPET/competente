import { Either, right } from "@/api/@types/either";
import { TutorType } from "../../entities/tutor.entity";
import { TutorRepository as InterfaceTutorRepository } from "../../repositories";

type ListTutorUseCaseResponse = Either<
  null,
  { tutors: TutorType[] }
>

export class ListTutorUseCase {

  constructor(private readonly repository: InterfaceTutorRepository) { }

  async execute(): Promise<ListTutorUseCaseResponse> {
    const tutors = await this.repository.list();
    return right({ tutors });
  }
}
