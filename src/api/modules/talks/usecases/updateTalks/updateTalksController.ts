import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateTalksUseCase } from './makeUpdateCompetianoUseCase';

const updateUserDateParamsSchema = z.object({
    titulo: z.string().optional(),
    data: z.date().optional(),
    youtube_link: z.string().optional(),
    minutos: z.number().optional(),
    inscritos: z.array(z.string()).optional(),
    solicitacoes_certificados: z.array(z.string()).optional(),
    palestrantes: z.array(z.string()).optional(),
})

const updateUserNameBodySchema = z.object({
    titulo: z.string(),
});

const updateUserDataBodySchema = z.object({
    updateUserDateParamsSchema,
});

export async function updateTalksController(request: FastifyRequest, reply: FastifyReply) {

    const { titulo } = updateUserNameBodySchema.parse(request.params)

    const { updateUserDateParamsSchema } = updateUserDataBodySchema.parse(request.body);

    const updateTalksUseCase = makeUpdateTalksUseCase()

    const user = await updateTalksUseCase.execute({ titulo, updatedDate: updateUserDateParamsSchema })

    if (user.isLeft()) {
        return reply
            .status(404)
            .send({
                code: reply.statusCode,
                message: "Talks não encontrado.",
                error_message: user.value.message
            })
    }

    return reply.status(201).send({ updated_user: user.value.updatedTalks });
}
