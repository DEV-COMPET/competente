import { FastifyReply, FastifyRequest } from 'fastify';
import { makeListProjectMemberUseCase } from './makeListProjectMemberUseCase';

export async function listProjectMember(request: FastifyRequest, reply: FastifyReply) {

	const listProjectMemberUseCase = makeListProjectMemberUseCase()

	const projectmembers = await listProjectMemberUseCase.execute()

	if(projectmembers.isLeft())
		return reply.status(400).send({message: "Erro"})

	return reply.status(200).send(projectmembers.value.projectmembers);
}
