import { BaseRepository } from '../../../@types/repository';
import { WebhookType } from '../entities/webhooks.entities';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract listByName (name:string):Promise<T[]>|T[]
	public abstract deleteById(id: string): Promise<T | undefined> | T | undefined;
	public abstract getById(id: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type WebhookRepository = Repository<WebhookType>;