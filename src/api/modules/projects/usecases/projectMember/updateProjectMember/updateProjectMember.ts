import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateProjectMemberUseCase } from './makeUpdateProjectMemberUseCase';

const updateUserDataBodySchema = z.object({
    nome: z.string().optional(),
    email: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    urlImg: z.string().optional(),
    role: z.string().optional(),
    statement: z.string().optional()
})

const updateUserNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateProjectMember(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateUserNameBodySchema.parse(request.params)

    const updateUserDateParamsSchema = updateUserDataBodySchema.parse(request.body);

    const updateUserUseCase = makeUpdateProjectMemberUseCase()

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
