import { BaseRepository } from '../../../@types/repository';
import { TalksType } from '../entities/talks.entity';
import { TalksData } from './defaultMongoDBRepository/talksRepository';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract getByTitulo(titulo: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type TalksRepository = Repository<TalksType> & { update: (nome: string, updatedData: TalksData) => Promise<TalksType | undefined> };