import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateTalksUseCase } from './makeUpdateCompetianoUseCase';

const updateUserDateParamsBodySchema = z.object({
    titulo: z.string().optional(),
    data: z.date().optional(),
    youtube_link: z.string().optional(),
    minutos: z.number().optional(),
    inscritos: z.array(z.string()).optional(),
    solicitacoes_certificados: z.array(z.string()).optional(),
    palestrantes: z.array(z.string()).optional(),
    ativo: z.boolean().optional()
})

const updateUserNameBodySchema = z.object({
    titulo: z.string(),
});

export async function updateTalksController(request: FastifyRequest, reply: FastifyReply) {

    const { titulo } = updateUserNameBodySchema.parse(request.params)

    console.dir({ titulo: titulo})

    const updatedDate = updateUserDateParamsBodySchema.parse(request.body);

    console.dir({updatedDate:updatedDate})

    const updateTalksUseCase = makeUpdateTalksUseCase()

    const user = await updateTalksUseCase.execute({ titulo, updatedDate })

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
