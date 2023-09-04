import { CompetianoMongoDBRepository } from "@/api/modules/competianos/repositories/defaultMongoDBRepository/competianoRepository"
import { WebhookRepository } from "../../repositories/defaultMongoDBRepository/webhooksRepository"
import { SendAuthentiqueMessageCase } from "./sendAuthentiqueMessageUseCase"

export function makeSendAuthentiqueMessageCase() {
    const usersRepository = new WebhookRepository()
    const competianoRepository = new CompetianoMongoDBRepository()
    const useCase = new SendAuthentiqueMessageCase(usersRepository, competianoRepository)

    return useCase
}