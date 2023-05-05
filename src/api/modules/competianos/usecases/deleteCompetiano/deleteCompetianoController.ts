import { Request, Response } from "express";
import { CompetianoType } from "../../entities/competiano.entity";
import { InterfaceDeleteCompetianoUseCase } from "./deleteCompetianoUseCase";
export class DeleteCompetianoController {
  constructor(private useCase: InterfaceDeleteCompetianoUseCase) {}
  async handle(request: Request, response: Response) {
    const { nome } = request.body;
    try {
      const deletedMember = await this.useCase.execute({ nome });
      return response.json({ deletedMember });
    } catch (error: any) {
      return response.status(404).json({
        message: error.message,
        code: response.statusCode,
      });
    }
  }
}
