import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { validateEmail } from '../../validators';
import { makeGetParceiroByEmailUseCase } from './makeGetParceiroByEmailUseCase';

const userEmailBodySchema = z.object({
	email: z.string()
})

export async function getParceiroByEmail(request: FastifyRequest, reply: FastifyReply) {

	const { email } = userEmailBodySchema.parse(request.params);

	if (!validateEmail(email))
		return reply
			.status(422)
			.send({ message: "Entrada inválida! O email fornecido não corresponde a um email válido para busca." })

	const getParceiroByEmailUseCase = makeGetParceiroByEmailUseCase()

	const user = await getParceiroByEmailUseCase.execute({ email })

	if (user.isLeft()) {
		return reply
			.status(404)
			.send({ message: "Membro não encontrado", error_message: user.value.message })
	}

	return reply.status(201).send(user.value.parceiro);
}
