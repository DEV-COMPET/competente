import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteProjectUseCase } from './makeDeleteProjectUseCase';

export const deleteUserBodySchema = z.object({
	nome: z.string(),
});

export async function deleteProject(request: FastifyRequest, reply: FastifyReply) {

	const { nome } = deleteUserBodySchema.parse(request.body);

	const deleteUserUseCase = makeDeleteProjectUseCase()

	const user = await deleteUserUseCase.execute({
		nome
	});

	if (user.isLeft()) {
		return reply
			.status(404)
			.send({ error_message: user.value.message })
	}

	return reply.status(201).send({ deleted_user: user.value.deletedMember });
}
