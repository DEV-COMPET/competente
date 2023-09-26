import { FastifyInstance } from "fastify"
import { createTalksController } from "../modules/talks/usecases/createTalks/createTalksController";
import { findTalksByTitleController } from "../modules/talks/usecases/findTalksByTitle/findTalksByTitleController";

export async function talksRoutes(app: FastifyInstance) {
    app.post("/", createTalksController)
    app.get("/:titulo", findTalksByTitleController)
}