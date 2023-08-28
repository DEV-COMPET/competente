import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListCompetianoUseCase } from '../usecases/factories/makeListCompetianoUseCase';

export async function listCompetiano(request: FastifyRequest, reply: FastifyReply) {

	const listCompetianoUseCase = makeListCompetianoUseCase()

	const competianos = await listCompetianoUseCase.execute()

	return reply.status(404).send(competianos);
}
