import { FastifyReply, FastifyRequest } from 'fastify';
import { string, z } from 'zod';
import { makeGetCertificadoByTitleUseCase } from './makeGetCertificadoByTitleUseCase';


export const getCertificadoByTitleBodySchema = z.object({
	titulo: string()
});	

export async function getCertificadosByTitleController(request: FastifyRequest, reply: FastifyReply) {

	const { titulo } = getCertificadoByTitleBodySchema.parse(request.params);

	const getCertificadoByTitleUseCase = makeGetCertificadoByTitleUseCase()

	const user = await getCertificadoByTitleUseCase.execute({
		titulo
	});

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply.status(201).send({ created_user: user.value.certificates });
}
