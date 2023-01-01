import { Competiano } from '../../entities/competiano.entity';
import type { CompetianoRepository as InterfaceListCompetianoRepository } from '../../repositories';

export type InterfaceListCompetianoUseCase = {
	execute: () => Promise<Competiano[]>;
};
export class ListCompetianoUseCase implements InterfaceListCompetianoUseCase {
	constructor(private readonly competianoRepository: InterfaceListCompetianoRepository) { }
	async execute(): Promise<Competiano[]> {
		const competiano = await this.competianoRepository.list();
		return competiano
	}
}
