import { BaseRepository } from '../../../../@types/repository';
import type { ProjectType } from '../../entities/project.entity';
import { ProjectData } from './defaultMongoDBRepository/projectRepository';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract getByName(nome: string): Promise<T | undefined> | T | undefined;
	public abstract getByEmail(email: string): Promise<T | undefined> | T | undefined;
	public abstract deleteByName(nome: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type ProjectRepository = Repository<ProjectType> & { update: (nome: string, updatedData: ProjectData) => Promise<ProjectType | undefined> };
