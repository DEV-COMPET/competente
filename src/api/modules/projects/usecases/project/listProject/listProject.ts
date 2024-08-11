import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListProjectUseCase } from './makeListProjectUseCase';

export async function listProject(request: FastifyRequest, reply: FastifyReply) {

	const listProjectUseCase = makeListProjectUseCase()

	const projects = await listProjectUseCase.execute()

	if(projects.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(projects.value.projects);
}
