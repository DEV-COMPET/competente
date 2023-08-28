import { ResourceAlreadyExistsError } from "@/api/errors/resourceAlreadyExistsError";
import type { WebhookRepository as InterfaceWebhookRepository } from "../../repositories";
import { Either, left, right } from "@/api/@types/either";
import { DatabaseInternalError } from "@/api/errors/databaseInternalError";
import { WebhookType, Webhook } from "../../entities/webhooks.entities";


interface CreateDiscordWebhookUseCaseRequest {
    webhookData: WebhookType
}

type CreateDiscordWebhookUseCaseResponse = Either<
    ResourceAlreadyExistsError | DatabaseInternalError,
    { createdWebhook: WebhookType }
>

export class CreateDiscordWebhookUseCase {
    constructor(private readonly repository: InterfaceWebhookRepository) { }

    async execute({ webhookData }: CreateDiscordWebhookUseCaseRequest): Promise<CreateDiscordWebhookUseCaseResponse> {

        const existentWebhook = await this.repository.getById(webhookData.id);
        if (existentWebhook)
            return left(new ResourceAlreadyExistsError("Webhook no DB"))

        const createdWebhook = new Webhook(webhookData);
        
        try {
            await this.repository.create(webhookData);
            return right({ createdWebhook });
        
        } catch (error) {
            console.error(error);
            return left(new DatabaseInternalError("Desculpe, não foi possível registrar o Webhook no momento, por favor, tente novamente mais tarde!"))
        }


    }

}
