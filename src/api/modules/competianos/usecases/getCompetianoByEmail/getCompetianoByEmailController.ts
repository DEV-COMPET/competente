import { Request, Response } from "express";
import { validateEmail } from "../../validators";
import { IGetCompetianoByEmailUseCase } from "./getCompetianoByEmailUseCase";
interface IGetCompetianoByEmailController {
  handle: (request: Request, response: Response) => Promise<Response>
}
export class GetCompetianoByEmailController implements IGetCompetianoByEmailController {
  constructor(private useCase: IGetCompetianoByEmailUseCase) { }
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    try {
      if (!validateEmail(email)) {
				return response.status(422).json({
					message: "Entrada inválida! O email fornecido não corresponde a um email válido para busca.",
					code: response.statusCode
				})
			}
      const competiano = await this.useCase.execute(email)
      if (!competiano) {
        return response.status(404).json({
          message: "Membro não encontrado",
          status: response.statusCode
        })
      }
      return response.json(competiano)
    } catch (error: any) {
      return response.status(400).json({
        message: error.message,
        status: response.statusCode
      })
    }
  }
}