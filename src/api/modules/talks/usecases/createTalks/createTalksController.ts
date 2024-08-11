import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateTalksUseCase } from './makeCreateTalksUseCase';

export const createUserBodySchema = z.object({
	titulo: z.string(),
	data: z.string(),
	// youtube_link: z.string(),
	palestrantes: z.array(z.string())
});

export async function createTalksController(request: FastifyRequest, reply: FastifyReply) {

	const { data, titulo, palestrantes } = createUserBodySchema.parse(request.body);

	const dataDate = new Date(data)

	if (!titulo.includes("COMPET Talks"))
		return reply.status(422).send({
			message: "Titulo do talks inválido.",
			code: reply.statusCode
		})

	const createTalksUseCase = makeCreateTalksUseCase()

	const talksCreated = await createTalksUseCase.execute({
		data: dataDate, palestrantes, titulo
	});

	if (talksCreated.isLeft()) {
		return reply
			.status(400)
			.send( talksCreated.value )
	}

	return reply.status(201).send(talksCreated.value.createdTalks);
}
