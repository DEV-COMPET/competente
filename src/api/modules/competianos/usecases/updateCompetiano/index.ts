import { UpdateCompetianoUseCase } from "./updateCompetianoUseCase";
import { UpdateCompetianoController } from "./updateCompetianoController";
import { CompetianoMongoDBRepository as CompetianoRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository";
export default (): UpdateCompetianoController => {
  const repository = new CompetianoRepository();
  const useCase = new UpdateCompetianoUseCase(repository);
  return new UpdateCompetianoController(useCase);
};
