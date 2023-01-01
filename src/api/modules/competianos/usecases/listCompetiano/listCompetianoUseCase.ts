import { Competiano, CompetianoType } from '../../entities/competiano.entity';
import type { CompetianoRepository as InterfaceListCompetianoRepository } from '../../repositories';

export type InterfaceListCompetianoUseCase = {
	execute: () => Promise<CompetianoType[]>;
};
export class ListCompetianoUseCase implements InterfaceListCompetianoUseCase {
	constructor(private readonly competianoRepository: InterfaceListCompetianoRepository) { }
	async execute(): Promise<CompetianoType[]> {
		const competiano = await this.competianoRepository.list();
		return competiano
	}
}
