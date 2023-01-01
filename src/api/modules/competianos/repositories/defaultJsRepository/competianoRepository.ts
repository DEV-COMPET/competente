import type {Competiano} from '../../entities/competiano.entity';
import {DefaultJsRepository} from './';
import type {CompetianoRepository as InterfaceCompetianoRepository} from '../';
export class CompetianoRepository extends DefaultJsRepository<Competiano> implements InterfaceCompetianoRepository {
  public async getByEmail(email: string): Promise<Competiano|undefined>{
    const competiano = this.dataBase.find(competiano=>competiano.email===email)
    return competiano
  }
	public static getInstance(): CompetianoRepository {
		if (!CompetianoRepository.instance) {
			CompetianoRepository.instance = new CompetianoRepository();
		}

		return CompetianoRepository.instance;
	}

	private static instance: CompetianoRepository;
	private constructor() {
		super([]);
	}

	async getByName(name: string): Promise<Competiano | undefined> {
		const competiano = this.dataBase.find(competiano => competiano.name === name);
		return competiano;
	}
}
