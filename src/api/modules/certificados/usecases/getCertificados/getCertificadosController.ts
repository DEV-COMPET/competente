import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetCertificadosUseCase } from './makeGetCertificadosseCase';


export async function getCertificadosController(request: FastifyRequest, reply: FastifyReply) {

	const getCertificadoByTitleUseCase = makeGetCertificadosUseCase()

	const user = await getCertificadoByTitleUseCase.execute();

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply.status(201).send({ created_user: user.value.certificates });
}
