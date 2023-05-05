import { Competiano, CompetianoType } from "../../entities/competiano.entity";
import type { CompetianoRepository as InterfaceCreateCompetianoRepository } from "../../repositories";
export interface InterfaceCreateCompetianoUseCase {
  execute: (request: CompetianoType) => Promise<CompetianoType>;
}
export class CreateCompetianoUseCase
  implements InterfaceCreateCompetianoUseCase
{
  constructor(
    private readonly repository: InterfaceCreateCompetianoRepository
  ) {}
  async execute({
    nome,
    email,
    data_inicio,
    url_imagem,
    linkedin,
    lates,
  }: CompetianoType): Promise<CompetianoType> {
    const competianoExists = await this.repository.getByName(nome);
    if (!competianoExists) {
      const competiano = new Competiano({
        data_inicio,
        email,
        nome,
        url_imagem,
        linkedin,
        lates,
      });
      await this.repository.create(competiano);
      return competiano;
    }
    throw new Error(
      "O membro já se encontra cadastrado na nossa base de dados!"
    );
  }
}
