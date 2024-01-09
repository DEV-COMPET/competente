import { BaseRepository } from '../../../../@types/repository';
import type { ProjectMemberType } from '../../entities/projectMember.entity';
import { ProjectMemberData } from './defaultMongoDBRepository/projectMemberRepository';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract getByName(nome: string): Promise<T | undefined> | T | undefined;
	public abstract getByEmail(email: string): Promise<T | undefined> | T | undefined;
	public abstract deleteByName(nome: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type ProjectMemberRepository = Repository<ProjectMemberType> & { update: (nome: string, updatedData: ProjectMemberData) => Promise<ProjectMemberType | undefined> };
