import { FastifyInstance } from "fastify"
import { createCertificadosController } from "../modules/certificados/usecases/createCertificados/createCertificadosController"
import { getCertificadosByTitleController } from "../modules/certificados/usecases/getCertificadoByTitle/getCertificadoByTitleController"
import { getCertificadosController } from "../modules/certificados/usecases/getCertificados/getCertificadosController"


export async function certificadosRoutes(app: FastifyInstance) {
    app.post("/", createCertificadosController)
    app.get("/", getCertificadosController)
    app.get("/:titulo", getCertificadosByTitleController)
}