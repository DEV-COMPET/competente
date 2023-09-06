import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListCompetianoUseCase } from './makeListCompetianoUseCase';

export async function listCompetiano(request: FastifyRequest, reply: FastifyReply) {

	const listCompetianoUseCase = makeListCompetianoUseCase()

	const competianos = await listCompetianoUseCase.execute()

	return reply.status(200).send(competianos);
}
