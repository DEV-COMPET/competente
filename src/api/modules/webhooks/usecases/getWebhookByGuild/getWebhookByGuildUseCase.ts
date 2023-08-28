import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { WebhookRepository as InterfaceWebhookRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { DatabaseInternalError } from "@/api/errors/databaseInternalError";
import { WebhookType } from "../../entities/webhooks.entities";
import { ResourceNotFoundError } from "@/api/errors/resourceNotFoundError";

interface GetWebhookByGuildUseCaseRequest {
    guildId: string
}

type GetWebhookByGuildUseCaseResponse = Either<
    ResourceAlreadyExistsError | DatabaseInternalError,
    { webhook: WebhookType }
>

export class GetWebhookByGuildUseCase {
    constructor(private readonly repository: InterfaceWebhookRepository) { }

    async execute({ guildId }: GetWebhookByGuildUseCaseRequest): Promise<GetWebhookByGuildUseCaseResponse> {

        const webhooks = await this.repository.listByName("Autentique Webhook");
        const webhook = webhooks.find((webhook) => webhook.guildId === guildId);
        if (!webhook) 
            return left(new ResourceNotFoundError("Webhook do autentique nesse servidor"))
        
        return right({webhook});

    }

}
