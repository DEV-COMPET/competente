import { BaseRepository } from '../../../@types/repository';
import { MateriasType } from '../entities/materias.entity';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract deleteByNome(link: string): Promise<T | undefined> | T | undefined;
	public abstract getByNome(link: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type MateriaRepository = Repository<MateriasType>;