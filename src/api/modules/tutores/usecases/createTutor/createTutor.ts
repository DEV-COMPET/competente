import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateTutorUseCase } from './makeCreateTutorUseCase';
import { validateEmail, validateImgUrl, validateLinkedin } from '../../validators';

export const createTutorBodySchema = z.object({
	nome: z.string(),
	email: z.string(),
	linkedin: z.string().optional(),
	resumo: z.string().optional(),
	urlImg: z.string().optional(),
});

export async function createTutor(request: FastifyRequest, reply: FastifyReply) {

	const { email, nome, linkedin, resumo, urlImg } = createTutorBodySchema.parse(request.body);

	if (!validateEmail(email))
		return reply
			.status(422)
			.send({
				message: "Email inválido",
				code: reply.statusCode
			})

	if (urlImg && !validateImgUrl(urlImg))
		return reply.status(422).send({
			message:
				"Erro de validação, por favor forneça uma url válida do imgbb para a foto do novo membro!",
			code: reply.statusCode,
		});

	if (linkedin && !validateLinkedin(linkedin)) {
		return reply.status(422).send({
			message:
				"Erro de validação, por favor forneça uma url válida para o perfil do linkedin do novo membro!",
			code: reply.statusCode,
		});
	}

	const createUserUseCase = makeCreateTutorUseCase()

	const user = await createUserUseCase.execute({
		email, nome, linkedin, resumo, urlImg
	});

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply
		.status(201)
		.send(user.value.tutor);
}
