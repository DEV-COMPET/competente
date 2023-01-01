import type { CompetianoType} from '../entities/competiano.entity';
import type {BaseRepository} from './repository';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<void> ;
	public abstract list(): Promise<T[]> | T[];
	public abstract getByName(name: string): Promise<T | undefined> | T | undefined;
	public abstract getByEmail(email: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = {id: string} & T;

export type CompetianoRepository = Repository<CompetianoType>;
