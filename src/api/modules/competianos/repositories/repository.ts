export type BaseRepository<T> = {
	create(data: T): Promise<T>|T ;
	list (): Promise<T[]> | T[];
};
