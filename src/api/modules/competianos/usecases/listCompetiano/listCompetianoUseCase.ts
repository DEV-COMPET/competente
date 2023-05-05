import { CompetianoType } from "../../entities/competiano.entity";
import type { CompetianoRepository as InterfaceListCompetianoRepository } from "../../repositories";

export interface InterfaceListCompetianoUseCase {
  execute: () => Promise<CompetianoType[]>;
}
export class ListCompetianoUseCase implements InterfaceListCompetianoUseCase {
  constructor(private readonly repository: InterfaceListCompetianoRepository) {}
  async execute(): Promise<CompetianoType[]> {
    const competiano = await this.repository.list();
    return competiano;
  }
}
