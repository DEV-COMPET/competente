import { FastifyInstance } from 'fastify';
import { getCompetianoByEmail } from "../modules/competianos/controllers/getCompetianoByEmail";
import { createCompetiano } from "../modules/competianos/controllers/createCompetiano";
import { updateCompetiano } from "../modules/competianos/controllers/updateCompetiano";
import { deleteCompetiano } from "../modules/competianos/controllers/deleteCompetiano";
import { listCompetiano } from "../modules/competianos/controllers/listCompetiano";

export async function competianosRoutes(app: FastifyInstance) {
    app.get('/', listCompetiano)
    app.get('/:email', getCompetianoByEmail)
    app.post('/', createCompetiano)
    app.put("/:nome", updateCompetiano)
    app.delete("/", deleteCompetiano)
}