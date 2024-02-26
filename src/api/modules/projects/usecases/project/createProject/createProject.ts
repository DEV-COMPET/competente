import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateProjectUseCase } from './makeCreateProjectUseCase';

export const createUserBodySchema = z.object({
	nome: z.string(),
	descricao: z.string(),
	data_inicio: z.string(),
	thumb: z.string(),
});

export async function 	createProject(request: FastifyRequest, reply: FastifyReply) {

	const { data_inicio, descricao, nome, thumb } = createUserBodySchema.parse(request.body);

	const createUserUseCase = makeCreateProjectUseCase()

	const data_inicio_date = new Date(data_inicio);

	const user = await createUserUseCase.execute({
		data_inicio: data_inicio_date, descricao, nome, thumb
	});

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply
		.status(201)
		.send(user.value.project);
}
