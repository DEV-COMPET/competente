import { FastifyInstance } from "fastify"
import { createMateriaController } from "../modules/materias/usecases/createMateria/createMateriaController"
import { listMaterias } from "../modules/materias/usecases/listMaterias/listMateria"

export async function materiasRoutes(app: FastifyInstance) {
    app.post("/", createMateriaController)
    app.get("/", listMaterias)
}