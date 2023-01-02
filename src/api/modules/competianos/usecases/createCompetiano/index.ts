import { CreateCompetianoUseCase } from "./createCompetianoUseCase";
import { CreateCompetianoController } from "./createCompetianoController";
import { CompetianoMongoDBRepository as CompetianoRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository";
export default (): CreateCompetianoController => {
	const repository = new CompetianoRepository();
	const useCase = new CreateCompetianoUseCase(repository);
	return new CreateCompetianoController(useCase);
};