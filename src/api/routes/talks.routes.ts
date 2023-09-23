import { FastifyInstance } from "fastify"
import { createTalksController } from "../modules/talks/usecases/createTalks/createTalksController";

export async function talksRoutes(app: FastifyInstance) {
    app.post("/", createTalksController)
}