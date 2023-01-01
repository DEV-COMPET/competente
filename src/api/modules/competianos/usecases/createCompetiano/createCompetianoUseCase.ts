import { Competiano } from '../../entities/competiano.entity';
import type {CompetianoRepository as InterfaceCreateCompetianoRepository} from '../../repositories';
type InterfaceRequest = {
	name: string;
	email: string;
  data_inicio:Date
};
export type InterfaceCreateCompetianoUseCase = {
	execute: (request: InterfaceRequest) => Promise<void>;
};
export class CreateCompetianoUseCase implements InterfaceCreateCompetianoUseCase {
	constructor(private readonly competianoRepository: InterfaceCreateCompetianoRepository) {}
	async execute({name, email,data_inicio}: InterfaceRequest) {
		const competianoExists = await this.competianoRepository.getByName(name);
		if (competianoExists) {
			throw new Error('Esse competiano já existe!');
		}
    const competiano = new Competiano({data_inicio,email,name})
		await this.competianoRepository.create(competiano);
	}
}
