import { CreateCompetianoUseCase } from "./createCompetianoUseCase";
import { CreateCompetianoController } from "./createCompetianoController";
import { CompetianoMongoDBRepository as CompetianoRepository } from "../../repositories/defaultMongoDBRepository/competianoRepository";
export default (): CreateCompetianoController => {
	const competianoRepository = new CompetianoRepository();
	const createCompetianoUseCase = new CreateCompetianoUseCase(competianoRepository);
	const createCompetianoController = new CreateCompetianoController(createCompetianoUseCase);
	return createCompetianoController;
};