export type BaseRepository<T> = {
	create(data: T): void ;
	list (): Promise<T[]> | T[];
};
