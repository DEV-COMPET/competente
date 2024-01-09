import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateParceiroUseCase } from './makeUpdateParceiroUseCase';

const updateUserDataBodySchema = z.object({
    nome: z.string().optional(),
    imgUrl: z.string().optional(),
    url: z.string().optional(),
})

const updateUserNameBodySchema = z.object({
    nome: z.string(),
});

export async function updateParceiro(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateUserNameBodySchema.parse(request.params)

    const updateUserDateParamsSchema = updateUserDataBodySchema.parse(request.body);

    const updateUserUseCase = makeUpdateParceiroUseCase()

    const user = await updateUserUseCase.execute({ nome, updatedDate: updateUserDateParamsSchema })

    if (user.isLeft()) {
        return reply
            .status(404)
            .send({
                code: reply.statusCode,
                message: "Membro não encontrado.",
                error_message: user.value.message
            })
    }

    return reply.status(201).send({ updated_user: user.value.updatedMember });
}
