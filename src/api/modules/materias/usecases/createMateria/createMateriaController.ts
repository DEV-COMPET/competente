import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateMateriaUseCase } from './makeCreateMateriaUseCase';

export const createMateriaBodySchema = z.object({
	nome: z.string(),
	periodo: z.string(),
	natureza: z.string(),
	corequisitos: z.array(z.string()),
	prerequisitos: z.array(z.string())
})

export async function createMateriaController(request: FastifyRequest, reply: FastifyReply) {

	const { ...materia } = createMateriaBodySchema.parse(request.body);

	const createMateriaUseCase = makeCreateMateriaUseCase()

	const materiasCreated = await createMateriaUseCase.execute({
		materia
	});

	if (materiasCreated.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: materiasCreated.value.message })
	}

	return reply.status(201).send({ created_user: materiasCreated.value.createdMaterias });
}
