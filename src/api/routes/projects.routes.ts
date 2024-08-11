import { FastifyInstance } from 'fastify';
import { listProject } from '../modules/projects/usecases/project/listProject/listProject';
import { getProjectByName } from '../modules/projects/usecases/project/getProjectByName/getProjectByName';
import { createProject } from '../modules/projects/usecases/project/createProject/createProject';
import { updateProject } from '../modules/projects/usecases/project/updateProject/updateProject';
import { deleteProject } from '../modules/projects/usecases/project/deleteProject/deleteProject';

export async function projectsRoutes(app: FastifyInstance) {
    app.get('/', listProject)
    app.get('/:name', getProjectByName)
    app.post('/', createProject)
    app.put("/:nome", updateProject)
    app.delete("/", deleteProject)
}