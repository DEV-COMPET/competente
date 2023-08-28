import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateDiscordWebhookUseCase } from './makeCreateDiscordWebhookUseCase';

const WebhookDataSchema = z.object({
	name: z.string(),
    id: z.string(),
    token: z.string(),
    guildId: z.string()
})

export const createDiscordWebhookCBodySchema = z.object({
	WebhookDataSchema
});

export async function createDiscordWebhookController(request: FastifyRequest, reply: FastifyReply) {

	const { WebhookDataSchema } = createDiscordWebhookCBodySchema.parse(request.body);

	const createCertificateUseCase = makeCreateDiscordWebhookUseCase()

	const certificatesCreated = await createCertificateUseCase.execute({
		webhookData: WebhookDataSchema
	});

	if (certificatesCreated.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: certificatesCreated.value.message })
	}

	return reply.status(201).send({ created_user: certificatesCreated.value.createdWebhook });
}
