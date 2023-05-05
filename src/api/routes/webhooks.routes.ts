import { Router } from "express";
import getDiscordWebhookByGuildId from "../modules/webhooks/useCases/getWebhookByGuild";
import createDiscordWebhook from "../modules/webhooks/useCases/createDiscordWebhook";
import sendAuthentiqueMessage from "../modules/webhooks/useCases/sendAuthentiqueMessage";
const router = Router();
router.post("/discord/", async (request, response) =>
  createDiscordWebhook().handler(request, response)
);
router.get("/discord/:guildId", async (request, response) =>
  getDiscordWebhookByGuildId().handle(request, response)
);
router.post("/autentique", (request, response) =>
  sendAuthentiqueMessage().handler(request, response)
);
export default router;
