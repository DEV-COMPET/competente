import { BaseRepository } from '../../../@types/repository';
import type { ParceiroType } from '../entities/parceiro.entity';
import { ParceiroData } from './defaultMongoDBRepository/parceiroRepository';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract getByName(nome: string): Promise<T | undefined> | T | undefined;
	public abstract getByEmail(email: string): Promise<T | undefined> | T | undefined;
	public abstract deleteByName(nome: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type ParceiroRepository = Repository<ParceiroType> & { update: (nome: string, updatedData: ParceiroData) => Promise<ParceiroType | undefined> };
