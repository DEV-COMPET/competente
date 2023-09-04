import { WebhookRepository } from "../../repositories/defaultMongoDBRepository/webhooksRepository"
import { GetWebhookByGuildUseCase } from "./getWebhookByGuildUseCase"

export function makeGetWebhookByGuildUseCase() {
    const usersRepository = new WebhookRepository()
    const useCase = new GetWebhookByGuildUseCase(usersRepository)

    return useCase
}