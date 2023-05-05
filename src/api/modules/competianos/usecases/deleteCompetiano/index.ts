import { DeleteCompetianoUseCase } from "./deleteCompetianoUseCase";
import { DeleteCompetianoController } from "./deleteCompetianoController";
import { CompetianoMongoDBRepository as CompetianoRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository";
export default (): DeleteCompetianoController => {
  const repository = new CompetianoRepository();
  const useCase = new DeleteCompetianoUseCase(repository);
  return new DeleteCompetianoController(useCase);
};
