import type { Request, Response } from 'express';
import { CompetianoType } from '../../entities/competiano.entity';
import type { CreateCompetianoUseCase as ICreateCompetianoUseCase } from './createCompetianoUseCase'
import validators from '../../validators';
export class CreateCompetianoController {
	constructor(private readonly useCase: ICreateCompetianoUseCase) { }
	async handle(request: Request, response: Response): Promise<Response> {
		const { nome, email, data_inicio, lates, linkedin, url_imagem }: CompetianoType = request.body;
		const dataInicial = new Date(data_inicio)
		try {
			if (!validators.validateEmail(email)) {
				return response.status(422).json({
					message: "Email inválido",
					code: response.statusCode
				})
			}
			if (!url_imagem || !validators.validateImgUrl(url_imagem)) {
				return response.status(422).json({
					message: "Erro de validação, por favor forneça uma url válida do imgbb para a foto do novo membro!",
					code: response.statusCode
				})
			}
			if (!linkedin || !validators.validateLinkedin(linkedin)) {
				return response.status(422).json({
					message: "Erro de validação, por favor forneça uma url válida para o perfil do linkedin do novo membro!",
					code: response.statusCode
				})
			}
			const memberCreated = await this.useCase.execute({
				nome,
				email,
				lates,
				linkedin,
				url_imagem,
				data_inicio: dataInicial,
			});
			return response.status(201).json(memberCreated);
		} catch (error: any) {
			console.error(error);
			response.status(400).json({
				code: response.statusCode,
				message: error.message
			});
		}
		return response.status(500).json({
			code: response.statusCode,
			message: "Erro interno no servidor, por favor tente novamente mais tarde, ou contate os desenvolvedores."
		});
	}
}
