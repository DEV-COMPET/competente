import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetWebhookByGuildUseCase } from './makeGetWebhookByGuildUseCase';

export const getWebhookByGuildCBodySchema = z.object({
    guildId: z.string()
});

export async function getWebhookByGuildController(request: FastifyRequest, reply: FastifyReply) {

	const { guildId } = getWebhookByGuildCBodySchema.parse(request.params);

	const createCertificateUseCase = makeGetWebhookByGuildUseCase()

	const certificatesCreated = await createCertificateUseCase.execute({
		guildId
	});

	if (certificatesCreated.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: certificatesCreated.value.message })
	}

	return reply.status(201).send({ created_user: certificatesCreated.value.webhook });
}
