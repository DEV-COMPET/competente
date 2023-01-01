import type {Request, Response} from 'express';
import type {CreateCompetianoUseCase as ICreateCompetianoUseCase} from './createCompetianoUseCase'
type InterfaceRequest = {
	name: string;
	email: string;
  data_inicio:string
};
export class CreateCompetianoController {
	constructor(private readonly createCompetianoUseCase: ICreateCompetianoUseCase) {}
	async handle(request: Request, response: Response): Promise<Response> {
		const {name,email,data_inicio} = request.body as InterfaceRequest;
		const dataInicial = new Date(data_inicio)
		try {
			await this.createCompetianoUseCase.execute({email, name,data_inicio:dataInicial});
		} catch (error:any) {
			console.error(error);
			response.status(422).json({
        code:response.statusCode,
        message:error.message
      });
		}
		return response.status(201).send();
	}
}
