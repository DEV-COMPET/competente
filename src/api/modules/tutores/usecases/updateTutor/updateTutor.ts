import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateTutorUseCase } from './makeUpdateTutorUseCase';

const updateUserDataBodySchema = z.object({
    nome: z.string().optional(),
    data_inicio: z.date().optional(),
    email: z.string().optional(),
    membro_ativo: z.boolean().optional(),
    tutor: z.boolean().optional(),
    scrum_master: z.boolean().optional(),
    intercambio: z.boolean().optional(),
    data_fim: z.string().optional(),
    lates: z.string().optional(),
    linkedin: z.string().optional(),
    depoimentos: z.string().optional(),
    url_imagem: z.string().optional(),
    advertencias: z.number().optional()
})

const updateUserNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateTutor(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateUserNameBodySchema.parse(request.params)

    const updateUserDateParamsSchema = updateUserDataBodySchema.parse(request.body);

    const updatedDate = {...updateUserDateParamsSchema, data_fim: updateUserDateParamsSchema.data_fim ? new Date(updateUserDateParamsSchema.data_fim) : undefined}

    const updateUserUseCase = makeUpdateTutorUseCase()

    const user = await updateUserUseCase.execute({ nome, updatedDate })

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
