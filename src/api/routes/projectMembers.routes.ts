import { FastifyInstance } from 'fastify';
import { listProjectMember } from '../modules/projects/usecases/projectMember/listProjectMember/listProjectMember';
import { getProjectMemberByEmail } from '../modules/projects/usecases/projectMember/getProjectMemberByEmail/getProjectMemberByEmail';
import { createProjectMember } from '../modules/projects/usecases/projectMember/createProjectMember/createProjectMember';
import { updateProjectMember } from '../modules/projects/usecases/projectMember/updateProjectMember/updateProjectMember';
import { deleteProjectMember } from '../modules/projects/usecases/projectMember/deleteProjectMember/deleteProjectMember';

export async function projectmembersRoutes(app: FastifyInstance) {
    app.get('/', listProjectMember)
    app.get('/:email', getProjectMemberByEmail)
    app.post('/', createProjectMember)
    app.put("/:nome", updateProjectMember)
    app.delete("/", deleteProjectMember)
}