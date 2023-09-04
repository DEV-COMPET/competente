import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateCertificateUseCase } from './makeCreateCertificadosUseCase';

const certificates = z.object({
	titulo: z.string(),
	data: z.date(),
	link: z.string(),
	compet_talks: z.boolean(),
	compbio: z.boolean(),
	listaNomes: z.array(z.string())
})

export const createUserBodySchema = z.object({
	certificates
});

export async function createCertificadosController(request: FastifyRequest, reply: FastifyReply) {

	const { certificates } = createUserBodySchema.parse(request.body);

	if (certificates.listaNomes.length === 0) {
		return reply.status(422).send({
			message: "Erro de input, verifique a lista de nomes cadastrada, não é possível gerar certificados para 0 pessoas!",
			code: reply.statusCode
		})
	}

	if (new Date(certificates.data).getTime() > new Date().getTime()) {
		return reply.status(422).send({
			message: "Data de certificado incorreta, o certificado não pode ser criado em uma data futura.",
			code: reply.statusCode
		})
	}

	if (certificates.titulo.length <= 4) {
		return reply.status(422).send({
			message: "Erro de input, o título do certificado deve ser maior do que 4 caracteres!",
			code: reply.statusCode
		})
	}

	const createCertificateUseCase = makeCreateCertificateUseCase()

	const certificatesCreated = await createCertificateUseCase.execute({
		certificates
	});

	if (certificatesCreated.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: certificatesCreated.value.message })
	}

	return reply.status(201).send({ created_user: certificatesCreated.value.createdCertificates });
}
