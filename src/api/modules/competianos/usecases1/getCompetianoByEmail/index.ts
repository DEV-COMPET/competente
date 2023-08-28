import { CompetianoMongoDBRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository";
import { GetCompetianoByEmailUseCase } from "./getCompetianoByEmailUseCase";
import { GetCompetianoByEmailController } from "./getCompetianoByEmailController";
export default (): GetCompetianoByEmailController => {
  const repository = new CompetianoMongoDBRepository();
  const useCase = new GetCompetianoByEmailUseCase(repository);
  return new GetCompetianoByEmailController(useCase);
};
