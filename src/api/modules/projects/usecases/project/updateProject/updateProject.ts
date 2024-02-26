import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateProjectUseCase } from './makeUpdateProjectUseCase';
import { createParceiroBodySchema } from '@/api/modules/parceiros/usecases/createParceiro/createParceiro';
import { createTutorBodySchema } from '@/api/modules/tutores/usecases/createTutor/createTutor';
import { createProjectMemberBodySchema } from '../../projectMember/createProjectMember/createProjectMember';

const updateUserDataBodySchema = z.object({
    nome: z.string().optional(),
    descricao: z.string().optional(),
    data_inicio: z.string().optional(),
    thumb: z.string().optional(),
    members: z.array(createProjectMemberBodySchema).optional(),
    tutors: z.array(createTutorBodySchema).optional(),
    partners: z.array(createParceiroBodySchema).optional(),
})

const updateUserNameBodySchema = z.object({
    nome: z.string(),
});


export async function updateProject(request: FastifyRequest, reply: FastifyReply) {

    const { nome } = updateUserNameBodySchema.parse(request.params)

    const updateUserDateParamsSchema = updateUserDataBodySchema.parse(request.body);

    const updateUserUseCase = makeUpdateProjectUseCase()

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
