import { TalksRepository } from "../../repositories";
import { TalksType } from "../../entities/talks.entity";
import { Either, left, right } from "@/api/@types/either";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError"
import { TalksData } from "../../repositories/defaultMongoDBRepository/talksRepository";

interface UpdateTalksUseCaseRequest {
    titulo: string
    updatedDate: TalksData
}
  
type UpdateTalksUseCaseResponse = Either<
    ResourceNotFoundError,
    { updatedTalks: TalksType }
>

export class UpdateTalksUseCase {

  constructor(private repository: TalksRepository) {}
  
  async execute({titulo, updatedDate}: UpdateTalksUseCaseRequest): Promise<UpdateTalksUseCaseResponse> {
    const talks = await this.repository.getByTitulo(titulo);
    
    if (!talks) 
      return left(new ResourceNotFoundError("Talks a ser Atualizado"));

    const updatedTalks = await this.repository.update(titulo, updatedDate) as TalksType;

    return right({ updatedTalks });
  }
}
