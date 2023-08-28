import type { Request, Response } from "express";
import type { ListCompetianoUseCase as IListCompetianoUseCase } from "./listCompetianoUseCase";
import { FastifyReply, FastifyRequest } from "fastify";

export class ListCompetianoController {
  
  constructor(private readonly useCase: IListCompetianoUseCase) {}
  async handle(request: FastifyRequest, response: FastifyReply): Promise<Response> {
    try {
      const competianos = await this.useCase.execute();
      return response.json(competianos);
    } catch (error: unknown) {
      console.error(error);
      response.status(404).json(error);
    }
    return response.status(500);
  }
}
