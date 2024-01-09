import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListTutorUseCase } from './makeListTutorUseCase';

export async function listTutor(request: FastifyRequest, reply: FastifyReply) {

	const listTutorUseCase = makeListTutorUseCase()

	const tutors = await listTutorUseCase.execute()

	if(tutors.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(tutors.value.tutors);
}
