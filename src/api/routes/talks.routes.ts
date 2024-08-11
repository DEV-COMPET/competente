import { FastifyInstance } from "fastify"
import { createTalksController } from "../modules/talks/usecases/createTalks/createTalksController";
import { findTalksByTitleController } from "../modules/talks/usecases/findTalksByTitle/findTalksByTitleController";
import { updateTalksController } from "../modules/talks/usecases/updateTalks/updateTalksController";

export async function talksRoutes(app: FastifyInstance) {
    app.post("/", createTalksController)
    app.get("/:titulo", findTalksByTitleController)
    app.put("/:titulo", updateTalksController)
}