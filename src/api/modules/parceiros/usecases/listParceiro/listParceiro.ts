import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListParceiroUseCase } from './makeListParceiroUseCase';

export async function listParceiro(request: FastifyRequest, reply: FastifyReply) {

	const listParceiroUseCase = makeListParceiroUseCase()

	const parceiros = await listParceiroUseCase.execute()

	if(parceiros.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(parceiros.value.parceiros);
}
