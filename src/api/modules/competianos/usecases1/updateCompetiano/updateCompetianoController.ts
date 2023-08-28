import { Request, Response } from "express";
import { MemberData } from "../../repositories/defaultMongoDBRepository/competianoRepository";
import { IUpdateCompetianoUseCase } from "./updateCompetianoUseCase";
export class UpdateCompetianoController {
  constructor(private useCase: IUpdateCompetianoUseCase) {}
  async handle(request: Request, response: Response): Promise<Response> {
    const { nome } = request.params;
    const competiano: MemberData = request.body;
    try {
      if (!nome) {
        return response.status(422).json({
          message: "Nome não pode ser vazio",
          code: response.statusCode,
        });
      }
      const updatedMember = await this.useCase.execute(nome, competiano);
      if (!updatedMember) {
        return response.status(404).json({
          code: response.statusCode,
          message: "Membro não encontrado.",
        });
      }
      return response.json(updatedMember);
    } catch (error: any) {
      return response.status(400).json({
        code: response.statusCode,
        message: error.message,
      });
    }
  }
}
