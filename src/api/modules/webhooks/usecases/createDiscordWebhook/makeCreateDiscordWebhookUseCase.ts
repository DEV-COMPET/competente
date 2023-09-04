import { WebhookRepository } from "../../repositories/defaultMongoDBRepository/webhooksRepository"
import { CreateDiscordWebhookUseCase } from "./createDiscordWebhookUseCase"

export function makeCreateDiscordWebhookUseCase() {
    const usersRepository = new WebhookRepository()
    const useCase = new CreateDiscordWebhookUseCase(usersRepository)

    return useCase
}