import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateParceiroUseCase } from './makeCreateParceiroUseCase';
import { validateImgUrl } from '../../validators';

export const createParceiroBodySchema = z.object({
	nome: z.string(),
	imgUrl: z.string(),
	url: z.string(),
});

export async function createParceiro(request: FastifyRequest, reply: FastifyReply) {

	const { imgUrl, nome, url } = createParceiroBodySchema.parse(request.body);

	if (imgUrl && !validateImgUrl(imgUrl))
		return reply.status(422).send({
			message:
				"Erro de validação, por favor forneça uma url válida do imgbb para a foto do novo membro!",
			code: reply.statusCode,
		});

	const createUserUseCase = makeCreateParceiroUseCase()

	const user = await createUserUseCase.execute({
		imgUrl, nome, url
	});

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply
		.status(201)
		.send(user.value.parceiro);
}
