import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFindTalksByTitleUseCase } from './makeCreateTalksUseCase';

export const findTalksByTitleBodySchema = z.object({
	titulo: z.string(),
});

export async function findTalksByTitleController(request: FastifyRequest, reply: FastifyReply) {

	const { titulo } = findTalksByTitleBodySchema.parse(request.params);

	console.log({titulo: titulo})

	const findTalksByTitleUseCase = makeFindTalksByTitleUseCase()

	const foundTalks = await findTalksByTitleUseCase.execute({ titulo });

	if (foundTalks.isLeft()) {
		return reply
			.status(400)
			.send(foundTalks.value)
	}

	return reply.status(201).send(foundTalks.value.talks);
}
