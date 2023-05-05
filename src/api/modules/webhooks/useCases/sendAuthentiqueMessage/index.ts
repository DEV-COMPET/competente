import { SendAutentiqueMessageUseCase } from "./sendAutentiqueMessageUseCase";
import { SendAutentiqueMessageController } from "./sendAutentiqueMessageController";
import { WebhookRepository } from "../../repositories/defaultMongoDBRepository/webhooksRepository";
import { CompetianoMongoDBRepository } from "../../../competianos/repositories/defaultMongoDBRepository/competianoRepository";
export default (): SendAutentiqueMessageController => {
  const whRepository = new WebhookRepository();
  const competianoRepository = new CompetianoMongoDBRepository();
  const useCase = new SendAutentiqueMessageUseCase(
    whRepository,
    competianoRepository
  );
  return new SendAutentiqueMessageController(useCase);
};
