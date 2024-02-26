import { FastifyInstance } from 'fastify';
import { listParceiro } from '../modules/parceiros/usecases/listParceiro/listParceiro';
import { getParceiroByEmail } from '../modules/parceiros/usecases/getParceiroByEmail/getParceiroByEmail';
import { createParceiro } from '../modules/parceiros/usecases/createParceiro/createParceiro';
import { updateParceiro } from '../modules/parceiros/usecases/updateParceiro/updateParceiro';
import { deleteParceiro } from '../modules/parceiros/usecases/deleteParceiro/deleteParceiro';

export async function parceirosRoutes(app: FastifyInstance) {
    app.get('/', listParceiro)
    app.get('/:email', getParceiroByEmail)
    app.post('/', createParceiro)
    app.put("/:nome", updateParceiro)
    app.delete("/", deleteParceiro)
}