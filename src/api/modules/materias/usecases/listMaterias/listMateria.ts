import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListMateriasUseCase } from './makeListMateriaUseCase';

export async function listMaterias(request: FastifyRequest, reply: FastifyReply) {

	const listMateriasUseCase = makeListMateriasUseCase()

	const materiass = await listMateriasUseCase.execute()

	if(materiass.isLeft())
		return reply.status(400).send(materiass.value)

	return reply.status(200).send(materiass.value.materias);
}
