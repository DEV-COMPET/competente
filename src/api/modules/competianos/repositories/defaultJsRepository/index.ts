import {BaseModel} from '../../entities/baseModel';
import {Repository} from '../';

export abstract class DefaultJsRepository <T> extends Repository<T> {
	protected readonly dataBase: T[];
	constructor(database: T[]) {
		super();
		this.dataBase = database;
	}

	public async create(data: T): Promise<void> {
		const {model} = new BaseModel<T>(data);
		this.dataBase.push(model);
	}

	public async list(): Promise<T[]> {
		const elements = this.dataBase;
		return elements;
	}
}
