import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateProjectMemberUseCase } from './makeCreateProjectMemberUseCase';
import { validateEmail, validateImgUrl, validateLinkedin } from "../../../validators"

export const createProjectMemberBodySchema = z.object({
	nome: z.string(),
	email: z.string(),
	linkedin: z.string().optional(),
	github: z.string().optional(),
	urlImg: z.string().optional(),
	role: z.string(),
	statement: z.string().optional()
});

export async function createProjectMember(request: FastifyRequest, reply: FastifyReply) {

	const { email, nome, role, github, linkedin, statement, urlImg } = createProjectMemberBodySchema.parse(request.body);

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

	const createUserUseCase = makeCreateProjectMemberUseCase()

	const user = await createUserUseCase.execute({
		email, nome, role, github, linkedin, statement, urlImg
	});

	if (user.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: user.value.message })
	}

	return reply
		.status(201)
		.send(user.value.projectmember);
}
