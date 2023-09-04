import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeSendAuthentiqueMessageCase } from './makeSendAuthentiqueMessageUseCase';

const AutentiqueVisualizadoSchema = z.object({
	created: z.string(),
	motivo: z.string().nullable(),
	ipv4: z.string(),
	geotrack: z.object({
		country: z.string(),
		countryISO: z.string(),
		state: z.string().nullable(),
		stateISO: z.string().nullable(),
		city: z.string().nullable(),
		zipcode: z.string().nullable(),
		latitude: z.number(),
		longitude: z.number(),
	})
});

const AutentiqueMailSchema = z.object({
	sent: z.union([z.boolean(), z.string()]),
	opened: z.union([z.boolean(), z.string()]).nullable(),
	refused: z.union([z.boolean(), z.string()]).nullable(),
	delivered: z.union([z.boolean(), z.string()]).nullable(),
	reason: z.string().nullable()
});

const AutentiqueParteSchema = z.object({
	nome: z.string().nullable(),
	email: z.string(),
	cpf: z.string().nullable(),
	nascimento: z.string().nullable(),
	empresa: z.string().nullable(),
	funcao: z.string(),
	visualizado: AutentiqueVisualizadoSchema,
	assinado: z.object({}),
	rejeitado: z.object({}),
	mail: AutentiqueMailSchema,
});


const AutentiqueDocumentoSchema = z.object({
	uuid: z.string(),
	nome: z.string(),
	rejeitavel: z.boolean(),
	created: z.string(),
	updated: z.string(),
	assinatura: z.string(),
	publicado: z.string(),
	disponivel: z.boolean(),
});

const AutentiqueRemetenteSchema = z.object({
	nome: z.string(),
	empresa: z.string(),
	email: z.string(),
	cpf: z.string(),
	nascimento: z.string(),
});

const AutentiqueArquivoSchema = z.object({
	original: z.string(),
	assinado: z.string(),
});


const AutentiqueApiResponseSchema = z.object({
	partes: z.array(AutentiqueParteSchema),
	documento: AutentiqueDocumentoSchema,
	remetente: AutentiqueRemetenteSchema,
	arquivo: AutentiqueArquivoSchema,
})

export const sendAutentiqueMessageBodySchema = z.object({
	apiResponse: AutentiqueApiResponseSchema
});

export async function sendAutentiqueMessageController(request: FastifyRequest, reply: FastifyReply) {

	const { apiResponse } = sendAutentiqueMessageBodySchema.parse(request.body);

	if (!apiResponse || !apiResponse.partes || !apiResponse.arquivo || !apiResponse.documento || !apiResponse.remetente) {
		return reply.status(400).send({
			message: "No data provided",
		});
	}

	const createCertificateUseCase = makeSendAuthentiqueMessageCase()

	const certificatesCreated = await createCertificateUseCase.execute({
		apiResponse
	});

	if (certificatesCreated.isLeft()) {
		return reply
			.status(400)
			.send({ error_message: certificatesCreated.value.message })
	}

	const { payload, webhook } = certificatesCreated.value

	await webhook.send(payload)

	return reply.status(200).send({ created_user: certificatesCreated.value.webhook });
}
