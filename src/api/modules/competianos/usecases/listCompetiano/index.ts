import { ListCompetianoUseCase } from "./listCompetianoUseCase";
import { ListCompetianoController } from "./listCompetianoController";
import { CompetianoMongoDBRepository as CompetianoRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository";
export default (): ListCompetianoController => {
	const repository = new CompetianoRepository();
	const useCase = new ListCompetianoUseCase(repository);
	return new ListCompetianoController(useCase);
};