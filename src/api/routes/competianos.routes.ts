import { FastifyInstance } from 'fastify';
import { listCompetiano } from '../modules/competianos/usecases/listCompetiano/listCompetiano';
import { getCompetianoByEmail } from '../modules/competianos/usecases/getCompetianoByEmail/getCompetianoByEmail';
import { createCompetiano } from '../modules/competianos/usecases/createCompetiano/createCompetiano';
import { updateCompetiano } from '../modules/competianos/usecases/updateCompetiano/updateCompetiano';
import { deleteCompetiano } from '../modules/competianos/usecases/deleteCompetiano/deleteCompetiano';

export async function competianosRoutes(app: FastifyInstance) {
    app.get('/', listCompetiano)
    app.get('/:email', getCompetianoByEmail)
    app.post('/', createCompetiano)
    app.put("/:nome", updateCompetiano)
    app.delete("/", deleteCompetiano)
}