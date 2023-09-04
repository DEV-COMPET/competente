import { FastifyInstance } from "fastify"
import { createDiscordWebhookController } from "../modules/webhooks/usecases/createDiscordWebhook/createDiscordWebhookController";
import { sendAutentiqueMessageController } from "../modules/webhooks/usecases/sendAuthentiqueMessage/sendAuthentiqueMessageController";
import { getWebhookByGuildController } from "../modules/webhooks/usecases/getWebhookByGuild/getWebhookByGuildController";

export async function webhooksRoutes(app: FastifyInstance) {
    app.post("/discord/", createDiscordWebhookController)
    app.get("/discord/:guildId", getWebhookByGuildController)
    app.get("/autentique", sendAutentiqueMessageController)
}