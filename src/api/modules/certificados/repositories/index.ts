import { BaseRepository } from '../../../@types/repository';
import { CertificatesType } from '../entities/certificados.entity';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract deleteByLink(link: string): Promise<T | undefined> | T | undefined;
	public abstract getByLink(link: string): Promise<T | undefined> | T | undefined;
	public abstract getByTitulo(titulo: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type CertificateRepository = Repository<CertificatesType>;