import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetProjectByNameUseCase } from './makeGetProjectByNameUseCase';

const userNameBodySchema = z.object({
	name: z.string()
})

export async function getProjectByName(request: FastifyRequest, reply: FastifyReply) {

	const { name } = userNameBodySchema.parse(request.params);

	const getProjectByNameUseCase = makeGetProjectByNameUseCase()

	const user = await getProjectByNameUseCase.execute({ name })

	if (user.isLeft()) {
		return reply
			.status(404)
			.send({ message: "Membro não encontrado", error_message: user.value.message })
	}

	return reply.status(201).send(user.value.project);
}
